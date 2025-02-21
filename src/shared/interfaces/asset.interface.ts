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
