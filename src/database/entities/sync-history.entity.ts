import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sync_history')
export class SyncHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sync_time: Date;

  @Column()
  status: string;

  @Column({ default: 0 })
  total_records: number;

  @Column({ default: 0 })
  success_count: number;

  @Column({ default: 0 })
  error_count: number;

  @Column({ type: 'text', nullable: true })
  error_details: string;
}
