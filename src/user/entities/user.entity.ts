import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Location } from '@/location/entities/location.entity';
import { Round } from '@/round/entities/round.entity';
import { Match } from '@/match/entities/match.entity';
import { MatchHistory } from '@/match-history/entities/match.history.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @ManyToOne(() => Location, (location) => location.users, {
    onDelete: 'SET NULL',
  })
  location?: Location;

  @ManyToMany(() => Match, (match) => match.users, { cascade: true })
  matches?: Match[];

  @OneToMany(() => Round, (round) => round.user)
  round: Round[];

  @OneToMany(() => MatchHistory, (mh) => mh.user, {
    eager: false,
    lazy: true,
  })
  matchHistory: MatchHistory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
