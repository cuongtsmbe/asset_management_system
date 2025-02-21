import { Controller, Get, Post, Param } from '@nestjs/common';
import { AssetService } from '../services/asset.service';
import {
  IAssetDetail,
  IAssetResponse,
  IAssetSyncHistorys,
  IAssetSyncResponse,
} from 'src/shared/interfaces/asset.interface';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  async findAll(): Promise<IAssetResponse> {
    return this.assetService.findAll();
  }

  @Get(':serial')
  async findOne(@Param('serial') serial: string): Promise<IAssetDetail> {
    return this.assetService.findOne(serial);
  }

  @Post('sync')
  async syncAssets(): Promise<IAssetSyncResponse> {
    return this.assetService.syncAssets();
  }

  @Get('sync/history')
  async getSyncHistory(): Promise<IAssetSyncHistorys> {
    return this.assetService.getSyncHistory();
  }
}
