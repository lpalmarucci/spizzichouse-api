import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Match } from '@/match/entities/match.entity';
import { User } from '@/user/entities/user.entity';

@Entity()
export class Round {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Match, (match) => match.rounds)
  match: Match;

  @Column()
  numPoints: number;

  @Column({ nullable: true })
  isGameLost?: boolean;

  @ManyToMany(() => User, (user) => user.round)
  @JoinTable()
  users: User[];
}
