import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Round } from '@/round/entities/round.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalPoints: number;

  @Column()
  maxPointsEachRound: number;

  @Column()
  inProgress: boolean;

  @OneToMany(() => Round, (round) => round.match)
  rounds: Round[];
}
