import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { AssetService } from '../services/asset.service';
import { Asset } from '../../../database/entities/asset.entity';
import {
  IAssetDetail,
  IAssetResponse,
  IAssetSyncHistorys,
} from 'src/shared/interfaces/asset.interface';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  async findAll(@Query('location_id') locationId?: number): Promise<Asset[]> {
    return this.assetService.findAll(locationId);
  }

  @Get(':serial')
  async findOne(@Param('serial') serial: string): Promise<IAssetDetail> {
    return this.assetService.findOne(serial);
  }

  @Post('sync')
  async syncAssets(): Promise<IAssetResponse> {
    return this.assetService.syncAssets();
  }

  @Get('sync/history')
  async getSyncHistory(): Promise<IAssetSyncHistorys> {
    return this.assetService.getSyncHistory();
  }
}
