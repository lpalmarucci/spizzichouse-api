import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Round } from '@/round/entities/round.entity';
import { Location } from '@/location/entities/location.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalPoints: number;

  @Column()
  maxPointsEachRound: number;

  @Column({ default: true })
  inProgress: boolean;

  @ManyToOne(() => Location, (location) => location.match)
  location: Location;

  @OneToMany(() => Round, (round) => round.match, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  rounds: Round[];
}
