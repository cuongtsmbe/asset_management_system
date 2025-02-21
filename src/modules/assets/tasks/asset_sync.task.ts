import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AssetService } from '../services/asset.service';

@Injectable()
export class AssetSyncTask {
  private readonly logger = new Logger(AssetSyncTask.name);

  constructor(private readonly assetService: AssetService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleAssetSync() {
    this.logger.log('Starting daily asset synchronization');
    await this.assetService.syncAssets();
  }
}
