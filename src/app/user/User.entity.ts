import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { randomUUID } from 'crypto';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  userId: string;

  @Column({ type: 'varchar' })
  firstname: string;

  @Column({ type: 'varchar' })
  lastname: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', default: null, nullable: true })
  @Exclude()
  token: string;
}
