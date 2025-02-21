import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Location } from './location.entity';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  serial: string;

  @Column()
  status: string;

  @Column()
  description: string;

  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  updated_at: number;

  @Column()
  location_id: number;

  @ManyToOne(() => Location, (location) => location.assets)
  @JoinColumn({ name: 'location_id' })
  location: Location;
}
