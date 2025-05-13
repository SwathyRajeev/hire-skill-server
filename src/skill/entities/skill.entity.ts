// skill.entity.ts
import { Category } from 'src/category/entities/category.entity';
import { DBTrailInfo } from 'src/common/utils/db-trail-info';
import { Provider } from 'src/provider/entities/provider.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum NatureOfWork {
  Onsite = 'onsite',
  Online = 'online',
}

@Entity('skills')
export class Skill extends DBTrailInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  experience: string;

  @Column({ type: 'enum', enum: NatureOfWork })
  natureOfWork: NatureOfWork;

  @Column('decimal', { precision: 10, scale: 2 })
  hourlyRate: number;

  @ManyToOne(() => Category, (category) => category.skill, { eager: true })
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Provider, (provider) => provider.skill)
  @JoinColumn()
  provider: Provider;
}
