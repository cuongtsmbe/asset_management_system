import { SyncHistory } from 'src/database/entities/sync_history.entity';
import { Status } from '../enums/asset.enum';
import { Asset } from 'src/database/entities/asset.entity';

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

export interface IAssetSyncResponse {
  status: boolean;
  message: string;
  data: SyncHistory;
}

export interface IAssetSyncHistorys {
  status: boolean;
  message?: string;
  data: SyncHistory[];
}

export interface IAssetDetail {
  status: boolean;
  message?: string;
  data: Asset;
}

export interface IAssetResponse {
  status: boolean;
  message?: string;
  data: Asset[];
}

export interface IAssetParameter {
  serial: string;
  type_id: number;
  status: Status;
  description: string | null;
  created_at: number;
  updated_at: number;
  location_organization_id: number;
}

export type AssetParameterValue = IAssetParameter[keyof IAssetParameter];
