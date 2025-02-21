import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Location } from './location.entity';
import { Organization } from './organization.entity';
import { Asset } from './asset.entity';
import { Status } from '../../shared/enums/asset.enum';
@Entity('location_organizations')
export class LocationOrganization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVED,
  })
  status: Status;

  @OneToMany(() => Asset, (asset) => asset.locationOrganization)
  assets: Asset[];

  @ManyToOne(() => Location, (location) => location.locationOrganizations, {
    nullable: false,
  })
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ManyToOne(() => Organization, (org) => org.locationOrganizations, {
    nullable: false,
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
