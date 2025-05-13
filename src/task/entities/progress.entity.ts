import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";
import { Provider } from "src/provider/entities/provider.entity";

@Entity('task_progress')
export class TaskProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @ManyToOne(() => Task, (task) => task.progressUpdates)
  task: Task;

  @ManyToOne(() => Provider)
  provider: Provider;
}
