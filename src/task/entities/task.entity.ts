import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { DBTrailInfo } from 'src/common/utils/db-trail-info';
import { TaskOffer } from './offer.entity';
import { TaskProgress } from './progress.entity';

export enum TaskStatus {
  ALL = 'ALL',
  CREATED = 'created',
  OFFER_PENDING = 'offer_pending',
  OFFER_ACCEPTED = 'offer_accepted',
  OFFER_REJECTED = 'offer_rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED_BY_PROVIDER = 'completed_by_provider',
  COMPLETION_ACCEPTED = 'completion_accepted',
  COMPLETION_REJECTED = 'completion_rejected',
  CANCELLED_BY_USER = 'cancelled_by_user',
  CANCELLED_BY_PROVIDER = 'cancelled_by_provider',
}

@Entity('tasks')
export class Task extends DBTrailInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskName: string;

  @Column('text')
  description: string;

  @Column()
  expectedStartDate: Date;

  @Column()
  expectedWorkingHours: number;

  @Column()
  hourlyRate: number;

  @Column()
  currency: 'USD' | 'AUD' | 'SGD' | 'INR';

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.CREATED })
  status: TaskStatus;

  @ManyToOne(() => Category)
  category: Category;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @OneToMany(() => TaskOffer, (offer) => offer.task)
  offers: TaskOffer[];

  @OneToMany(() => TaskProgress, (progress) => progress.task)
  progressUpdates: TaskProgress[];
}
