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

  @Column({ type: 'integer', default: 0 })
  totalWins: number;

  @Column({ type: 'integer', default: 0 })
  totalPlayed: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
