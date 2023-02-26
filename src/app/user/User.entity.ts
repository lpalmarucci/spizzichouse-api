import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Location } from '../location/entities/location.entity';
import { Match } from '../match/entities/match.entity';
import { Round } from '../round/entities/round.entity';

@Entity({ name: 'users' })
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ type: 'varchar' })
  firstname: string;

  @Column({ type: 'varchar' })
  lastname: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', default: null, nullable: true })
  @Exclude()
  token: string;

  @ManyToOne(() => Location, (house) => house.players, {
    cascade: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @ManyToMany(() => Match, (play) => play.location)
  plays: Match[];

  @OneToMany(() => Round, (round) => round.user)
  rounds: Round[];
}
