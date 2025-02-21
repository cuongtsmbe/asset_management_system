import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { LocationOrganization } from './location_organization.entity';

@Entity('locations')
export class Location {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => LocationOrganization, (lo) => lo.location)
  locationOrganizations: LocationOrganization[];
}
