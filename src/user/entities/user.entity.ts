import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  password: string;

  @Column({ default: new Date(), type: 'timestamp' })
  createdAt: Date;

  @Column({
    default: new Date(),
    type: 'timestamp',
  })
  updatedAt: Date;
}
