import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { AssetService } from '../services/asset.service';
import { Asset } from '../../../database/entities/asset.entity';
import { IAssetResponse } from 'src/shared/interfaces/asset.interface';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  async findAll(@Query('location_id') locationId?: number): Promise<Asset[]> {
    return this.assetService.findAll(locationId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Asset> {
    return this.assetService.findOne(id);
  }

  @Post('sync')
  async syncAssets(): Promise<IAssetResponse> {
    return this.assetService.syncAssets();
  }

  @Get('sync/history')
  async getSyncHistory() {
    return this.assetService.getSyncHistory();
  }
}
