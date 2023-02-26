import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';

@Entity()
export class House {
  @PrimaryGeneratedColumn()
  houseId: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
