import { User } from 'src/app/user/User.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'rounds' })
export class Round {
  @PrimaryGeneratedColumn('uuid')
  roundId: string;

  @ManyToOne(() => User, (user) => user.rounds, { cascade: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int', unsigned: true, nullable: true })
  points: number;

  //TODO Add match reference
}
