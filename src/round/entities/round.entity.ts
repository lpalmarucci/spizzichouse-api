import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ nullable: true, default: false })
  isGameLost?: boolean;

  @ManyToOne(() => User, (user) => user.round)
  user: User;
}
