import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Match } from '@/match/entities/match.entity';
import { User } from '@/user/entities/user.entity';
import { Min } from 'class-validator';

@Entity()
@Unique(['roundId', 'userId', 'matchId'])
export class Round {
  @PrimaryColumn()
  roundId: number;

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  matchId: number;

  @ManyToOne(() => User, (user) => user.round, { eager: true, nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Match, (match) => match.rounds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @Column()
  @Min(0)
  points: number;
}
