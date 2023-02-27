import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/app/user/User.entity';
import { Match } from 'src/app/match/entities/match.entity';

@Entity({ name: 'locations' })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  locationId: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => User, (photo) => photo.location)
  players: User[];

  @OneToMany(() => Match, (play) => play.location)
  matches: Match[];
}
