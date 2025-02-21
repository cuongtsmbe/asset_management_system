import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LocationOrganization } from './location-organization.entity';
import { AssetType } from './asset-type.entity';
import { AssetStatus } from '../../shared/enums/asset-status.enum';

@Entity('assets')
export class Asset {
  @PrimaryColumn()
  @Index('IDX_ASSET_SERIAL', { unique: true })
  serial: string;

  @Column()
  type_id: string;

  @Column({
    type: 'enum',
    enum: AssetStatus,
    default: AssetStatus.ACTIVE,
  })
  status: AssetStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  updated_at: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_synced_at: Date;

  @ManyToOne(
    (): typeof LocationOrganization => LocationOrganization,
    (lo: LocationOrganization) => lo.assets,
    {
      nullable: false,
    }
  )
  @JoinColumn({ name: 'location_organization_id' })
  locationOrganization: LocationOrganization;

  @ManyToOne(
    (): typeof AssetType => AssetType,
    (type: AssetType) => type.assets,
    {
      nullable: false,
      eager: true,
    }
  )
  @JoinColumn({ name: 'type_id' })
  assetType: AssetType;
}
