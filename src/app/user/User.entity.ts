import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { randomUUID } from 'crypto';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  userId: string = randomUUID();

  @Column({ type: 'varchar' })
  firstname: string;

  @Column({ type: 'varchar' })
  lastname: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'timestamp' })
  created_at: number = new Date().getTime();

  @Column({ type: 'varchar', default: null })
  @Exclude()
  token: string | null = null;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
