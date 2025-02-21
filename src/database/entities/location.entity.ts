import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  organization: string;

  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => Asset, (asset) => asset.location)
  assets: Asset[];
} 