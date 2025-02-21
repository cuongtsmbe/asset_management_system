import { SyncHistory } from 'src/database/entities/sync_history.entity';
import { Status } from '../enums/asset.enum';

export interface IAsset {
  id: string;
  type: string;
  serial: string;
  status: Status;
  description: string;
  created_at: number;
  updated_at: number;
  location_id: number;
}

export interface IAssetResponse {
  status: boolean;
  message: string;
  data: SyncHistory;
}

export interface IAssetSyncHistorys {
  status: boolean;
  message?: string;
  data: SyncHistory[];
}
