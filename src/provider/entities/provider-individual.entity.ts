import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "./provider.entity";

@Entity()
export class ProviderIndividualDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Provider, provider => provider.individualDetails)
  @JoinColumn()
  provider: Provider;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  mobileNumber: string;
}
