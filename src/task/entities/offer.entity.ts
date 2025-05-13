import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";
import { Provider } from "src/provider/entities/provider.entity";

@Entity('task_offer')
export class TaskOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rate: number;

  @Column()
  message: string;

  @Column({ default: false })
  isAccepted: boolean;

  @Column({ default: false })
  isRejected: boolean;

  @ManyToOne(() => Task, (task) => task.offers)
  task: Task;

  @ManyToOne(() => Provider)
  provider: Provider;
}
