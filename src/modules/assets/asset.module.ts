import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetController } from './controllers/asset.controller';
import { AssetService } from './services/asset.service';
import { AssetSyncTask } from './tasks/asset_sync.task';
import { Asset } from '../../database/entities/asset.entity';
import { Location } from '../../database/entities/location.entity';
import { SyncHistory } from 'src/database/entities/sync_history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, Location, SyncHistory])],
  controllers: [AssetController],
  providers: [AssetService, AssetSyncTask],
})
export class AssetModule {}
