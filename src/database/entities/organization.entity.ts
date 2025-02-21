import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LocationOrganization } from './location-organization.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => LocationOrganization, (lo) => lo.organization)
  locationOrganizations: LocationOrganization[];
}
