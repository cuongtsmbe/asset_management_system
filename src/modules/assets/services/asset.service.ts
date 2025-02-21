import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Asset } from '../../../database/entities/asset.entity';
import { Location } from '../../../database/entities/location.entity';
import axios from 'axios';
import { SyncHistory } from '../../../database/entities/sync_history.entity';
import {
  IAsset,
  IAssetDetail,
  IAssetResponse,
  IAssetSyncHistorys,
  IAssetSyncResponse,
} from 'src/shared/interfaces/asset.interface';
import { Status, SyncStatus } from 'src/shared/enums/asset.enum';
import { AssetType } from '../../../database/entities/asset_type.entity';

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
    @InjectRepository(AssetType)
    private assetTypeRepository: Repository<AssetType>,
  ) {}

  async syncAssets(): Promise<IAssetSyncResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const syncHistory = new SyncHistory();
    syncHistory.status = SyncStatus.IN_PROGRESS;

    try {
      this.logger.log('Synchronizing assets...');
      const [response, activeLocations, assetTypes] = await Promise.all([
        axios.get('https://669ce22d15704bb0e304842d.mockapi.io/assets'),
        this.locationRepository
          .createQueryBuilder('location')
          .select([
            'location.id as location_id',
            'lo.id as location_organization_id',
          ])
          .innerJoin('location.locationOrganizations', 'lo')
          .where('lo.status = :status', { status: Status.ACTIVED })
          .getRawMany(),
        this.assetTypeRepository.find(),
      ]);

      const externalAssets = response.data as IAsset[];
      syncHistory.total_records = externalAssets.length;

      const activeLocationIds = new Set(
        activeLocations.map((loc) => loc.location_id as number),
      );

      const typeMap = new Map(assetTypes.map((type) => [type.type, type.id]));
      const locationOrgMap = new Map(
        activeLocations.map((loc) => [
          loc.location_id,
          loc.location_organization_id,
        ]),
      );

      // Filter valid assets first
      const validAssets = externalAssets
        .filter(
          (asset) =>
            activeLocationIds.has(asset.location_id) &&
            asset.created_at < Date.now() &&
            typeMap.has(asset.type),
        )
        .map((asset) => ({
          serial: asset.serial,
          type_id: typeMap.get(asset.type) as number,
          status: asset.status,
          description: asset.description,
          locationOrganization: {
            id: locationOrgMap.get(asset.location_id) as number,
          },
          created_at: asset.created_at,
          updated_at: asset.updated_at,
          last_synced_at: new Date(),
        }));

      // Bulk upsert
      if (validAssets.length > 0) {
        const parameters: any[] | undefined = [];
        const values = validAssets
          .map((asset) => {
            parameters.push(
              asset.serial,
              asset.type_id,
              asset.status,
              asset.description,
              asset.created_at,
              asset.updated_at,
              asset.locationOrganization.id,
            );
            return '(?, ?, ?, ?, ?, ?, NOW(), ?)';
          })
          .join(',');

        await queryRunner.manager.query(
          `
          INSERT INTO assets (
            serial, 
            type_id, 
            status, 
            description, 
            created_at, 
            updated_at, 
            last_synced_at,
            location_organization_id
          ) 
          VALUES ${values}
          ON DUPLICATE KEY UPDATE
            type_id = VALUES(type_id),
            status = VALUES(status),
            description = VALUES(description),
            updated_at = VALUES(updated_at),
            last_synced_at = VALUES(last_synced_at),
            location_organization_id = VALUES(location_organization_id)
        `,
          parameters,
        );
      }

      syncHistory.success_count = validAssets.length;
      syncHistory.error_count = externalAssets.length - validAssets.length;
      syncHistory.status = SyncStatus.COMPLETED;

      await queryRunner.manager.save(SyncHistory, syncHistory);
      await queryRunner.commitTransaction();

      this.logger.log(
        `Assets synchronized successfully. Success: ${syncHistory.success_count}, Skipped: ${syncHistory.error_count}`,
      );
    } catch (error: unknown) {
      syncHistory.status = SyncStatus.FAILED;
      syncHistory.error_count = syncHistory.total_records;
      syncHistory.error_details =
        error instanceof Error ? error.message : 'Unknown error';

      await queryRunner.rollbackTransaction();
      await queryRunner.manager.save(SyncHistory, syncHistory);

      this.logger.error('Error synchronizing assets:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }

    return {
      status: syncHistory.status === SyncStatus.COMPLETED,
      message:
        syncHistory.status === SyncStatus.COMPLETED
          ? 'Assets synchronized successfully'
          : 'Assets synchronization failed',
      data: syncHistory,
    };
  }

  async findAll(): Promise<IAssetResponse> {
    const assets = await this.assetRepository.find({
      relations: [
        'locationOrganization',
        'locationOrganization.location',
        'locationOrganization.organization',
        'assetType',
      ],
      order: {
        created_at: 'DESC',
      },
    });

    return {
      status: true,
      message: 'Assets retrieved successfully',
      data: assets,
    };
  }

  async findOne(serial: string): Promise<IAssetDetail> {
    const asset = await this.assetRepository.findOne({
      where: { serial },
      relations: {
        locationOrganization: {
          location: true,
        },
        assetType: true,
      },
    });

    if (!asset) {
      throw new NotFoundException(`Asset with serial ${serial} not found`);
    }

    return {
      status: true,
      message: 'Asset retrieved successfully',
      data: asset,
    };
  }

  async getSyncHistory(): Promise<IAssetSyncHistorys> {
    const syncHistory = await this.syncHistoryRepository.find({
      order: { sync_time: 'DESC' },
    });

    return {
      status: true,
      message: 'Sync history retrieved successfully',
      data: syncHistory,
    };
  }
}
