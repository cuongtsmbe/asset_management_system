import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sync_history')
export class SyncHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sync_time: Date;

  @Column()
  status: string;

  @Column()
  total_records: number;

  @Column()
  success_count: number;

  @Column()
  error_count: number;

  @Column({ type: 'text', nullable: true })
  error_details: string;
} 