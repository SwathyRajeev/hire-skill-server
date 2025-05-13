import { Exclude } from 'class-transformer';
import { Provider } from 'src/provider/entities/provider.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  User = 'user',
  ProviderIndividual = 'provider_individual',
  ProviderCompany = 'provider_company',
}

@Entity('auth')
@Unique(['username'])
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  salt: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @OneToOne(() => User, (user) => user.auth)
  user: User;

  @OneToOne(() => Provider, (provider) => provider.auth)
  provider: Provider;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleteAt' })
  @Exclude({ toPlainOnly: true })
  deletedAt?: Date;
}
