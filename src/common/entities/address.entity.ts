import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  streetNo: string;

  @Column()
  streetName: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postCode: string;
}
