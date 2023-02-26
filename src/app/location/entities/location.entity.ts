import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/app/user/User.entity';

@Entity({ name: 'houses' })
export class House {
  @PrimaryGeneratedColumn('uuid')
  houseId: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => User, (photo) => photo.house)
  players: User[];
}
