import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetController } from './controllers/asset.controller';
import { AssetService } from './services/asset.service';
import { AssetSyncTask } from './tasks/asset-sync.task';
import { Asset } from '../../database/entities/asset.entity';
import { Location } from '../../database/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, Location])],
  controllers: [AssetController],
  providers: [AssetService, AssetSyncTask],
})
export class AssetModule {}
