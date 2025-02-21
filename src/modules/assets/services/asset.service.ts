import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Asset } from '../../../database/entities/asset.entity';
import { Location } from '../../../database/entities/location.entity';
import axios from 'axios';
import { SyncHistory } from '../../../database/entities/sync-history.entity';

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(SyncHistory)
    private syncHistoryRepository: Repository<SyncHistory>,
    private dataSource: DataSource,
  ) {}

  async syncAssets() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const syncHistory = new SyncHistory();
    syncHistory.status = 'IN_PROGRESS';
    syncHistory.total_records = 0;
    syncHistory.success_count = 0;
    syncHistory.error_count = 0;

    try {
      const response = await axios.get('https://669ce22d15704bb0e304842d.mockapi.io/assets');
      const externalAssets = response.data;
      
      syncHistory.total_records = externalAssets.length;

      // Get active locations from database
      const activeLocations = await this.locationRepository.find({
        where: { status: 'active' },
      });
      const activeLocationIds = activeLocations.map((loc) => loc.id);

      for (const externalAsset of externalAssets) {
        try {
          if (activeLocationIds.includes(externalAsset.location_id)) {
            const asset = await this.assetRepository.findOne({
              where: { id: externalAsset.id },
            });

            if (asset) {
              await queryRunner.manager.update(Asset, asset.id, {
                ...externalAsset,
                last_synced_at: new Date(),
              });
            } else {
              await queryRunner.manager.save(Asset, {
                ...externalAsset,
                last_synced_at: new Date(),
              });
            }
            syncHistory.success_count++;
          }
        } catch (err) {
          syncHistory.error_count++;
          syncHistory.error_details = `${syncHistory.error_details || ''}\nError with asset ${externalAsset.id}: ${err.message}`;
        }
      }

      syncHistory.status = 'COMPLETED';
      await queryRunner.manager.save(SyncHistory, syncHistory);
      await queryRunner.commitTransaction();
      
      this.logger.log(`Assets synchronized successfully. Success: ${syncHistory.success_count}, Errors: ${syncHistory.error_count}`);
    } catch (error) {
      syncHistory.status = 'FAILED';
      syncHistory.error_details = error.message;
      await queryRunner.manager.save(SyncHistory, syncHistory);
      
      await queryRunner.rollbackTransaction();
      this.logger.error('Error synchronizing assets:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(locationId?: number): Promise<Asset[]> {
    const queryBuilder = this.assetRepository
      .createQueryBuilder('asset')
      .leftJoinAndSelect('asset.location', 'location');

    if (locationId) {
      queryBuilder.where('asset.location_id = :locationId', { locationId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id },
      relations: ['location'],
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }

    return asset;
  }

  // Thêm API để xem lịch sử đồng bộ
  async getSyncHistory(): Promise<SyncHistory[]> {
    return this.syncHistoryRepository.find({
      order: { sync_time: 'DESC' },
    });
  }
}
