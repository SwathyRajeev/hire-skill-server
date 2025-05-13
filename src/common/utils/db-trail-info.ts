import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class DBTrailInfo {

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleteAt' })
  @Exclude({ toPlainOnly: true })
  deletedAt?: Date;

}