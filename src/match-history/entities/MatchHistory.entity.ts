import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { Match } from '@/match/entities/match.entity';

@Entity()
@Unique(['matchId', 'userId'])
export class MatchHistory {
  @PrimaryColumn()
  matchId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.round, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Match, (match) => match.rounds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @Column()
  win: boolean;

  @Column()
  totalScore: number;
}
