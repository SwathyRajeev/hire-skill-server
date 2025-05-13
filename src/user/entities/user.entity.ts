import { Auth } from 'src/auth/entities/auth.entity';
import { Address } from 'src/common/entities/address.entity';
import { DBTrailInfo } from 'src/common/utils/db-trail-info';
import { Task } from 'src/task/entities/task.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('user')
export class User extends DBTrailInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Auth, (auth) => auth.user)
  @JoinColumn()
  auth: Auth;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  mobileNumber: string;

  @ManyToOne(() => Address, { cascade: true, nullable: false })
  @JoinColumn()
  address: Address;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
