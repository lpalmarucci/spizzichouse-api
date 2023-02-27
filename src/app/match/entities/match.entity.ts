import { User } from '../../user/User.entity';
import { Location } from '../../location/entities/location.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'matches' })
export class Match {
  @PrimaryGeneratedColumn('uuid')
  matchId: string;

  @Column({ type: 'boolean', default: true })
  inProgress: boolean;

  @ManyToOne(() => Location, (house) => house.matches, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @ManyToMany(() => User, (user) => user.plays, { cascade: true, eager: true })
  @JoinTable({
    name: 'match_players',
    joinColumn: {
      name: 'matchId',
      referencedColumnName: 'matchId',
    },
    inverseJoinColumn: {
      name: 'playerId',
      referencedColumnName: 'userId',
    },
  })
  players: User[];

  @Column({ type: 'int', unsigned: true })
  maxPoints: number;

  @CreateDateColumn()
  date: Date;
}
