import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Round } from '@/round/entities/round.entity';
import { Location } from '@/location/entities/location.entity';
import { User } from '@/user/entities/user.entity';
import { MatchHistoryEntity } from '@/match-history/entities/match-history.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalPoints: number;

  @Column({ default: true })
  inProgress: boolean;

  @ManyToMany(() => User, (user) => user.matches)
  @JoinTable({ name: 'users_matches' })
  users: User[];

  @ManyToOne(() => Location, (location) => location.match, {
    onDelete: 'SET NULL',
  })
  location?: Location;

  @OneToMany(() => Round, (round) => round.match, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  rounds: Round[];

  @OneToMany(() => MatchHistoryEntity, (mh) => mh.match, {
    eager: false,
    lazy: true,
  })
  matchHistory: MatchHistoryEntity;
}
