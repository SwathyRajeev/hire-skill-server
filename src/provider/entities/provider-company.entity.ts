import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "./provider.entity";

@Entity()
export class ProviderCompanyDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Provider, provider => provider.companyDetails)
  @JoinColumn()
  provider: Provider;

  @Column()
  companyName: string;

  @Column()
  phoneNumber: string;

  @Column({ length: 10 })
  businessTaxNumber: string;

  @Column()
  repFirstName: string;

  @Column()
  repLastName: string;

  @Column()
  repEmail: string;

  @Column()
  repMobileNumber: string;
}
