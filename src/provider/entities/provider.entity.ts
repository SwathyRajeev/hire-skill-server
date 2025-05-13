import { Auth } from "src/auth/entities/auth.entity";
import { Address } from "src/common/entities/address.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProviderIndividualDetails } from "./provider-individual.entity";
import { ProviderCompanyDetails } from "./provider-company.entity";
import { Skill } from "src/skill/entities/skill.entity";
import { DBTrailInfo } from "src/common/utils/db-trail-info";

@Entity()
export class Provider extends DBTrailInfo{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Auth, auth => auth.provider)
  @JoinColumn()
  auth: Auth;

  @Column({ type: 'enum', enum: ['individual', 'company'] })
  providerType: 'individual' | 'company';

  @ManyToOne(() => Address, { cascade: true, nullable: true })
  @JoinColumn()
  address?: Address;

  @OneToOne(() => ProviderIndividualDetails, details => details.provider, { cascade: true })
  individualDetails?: ProviderIndividualDetails;

  @OneToOne(() => ProviderCompanyDetails, details => details.provider, { cascade: true })
  companyDetails?: ProviderCompanyDetails;

  @OneToMany(() => Skill, (skill) => skill.provider)
  skill: Skill[];
}

