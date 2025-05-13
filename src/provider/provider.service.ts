import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth, Role } from 'src/auth/entities/auth.entity';
import { Provider } from './entities/provider.entity';
import { Address } from 'src/common/entities/address.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { CreateProviderDto, ProviderType } from './dto/provider.dto';
import { ProviderCompanyDetails } from './entities/provider-company.entity';
import { ProviderIndividualDetails } from './entities/provider-individual.entity';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    @InjectRepository(Provider) private providerRepo: Repository<Provider>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
    @InjectRepository(ProviderCompanyDetails)
    private providerCompanyDetailsRepo: Repository<ProviderCompanyDetails>,
    @InjectRepository(ProviderIndividualDetails)
    private providerIndividualDetailsRepo: Repository<ProviderIndividualDetails>,

    private authService: AuthService,
  ) {}

  async signup(
    createProviderDto: CreateProviderDto,
  ): Promise<{ accessToken: string }> {
    const { username, password, providerType, address, ...details } =
      createProviderDto;

    const existing = await this.authRepo.findOne({ where: { username } });
    if (existing) throw new BadRequestException('Username already exists');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const role =
      providerType === ProviderType.Individual
        ? Role.ProviderIndividual
        : Role.ProviderCompany;

    const auth = this.authRepo.create({
      username,
      password: hashedPassword,
      salt,
      role,
    });
    await this.authRepo.save(auth);

    let savedAddress;
    if (address) {
      savedAddress = this.addressRepo.create(address);
      await this.addressRepo.save(savedAddress);
    }

    const provider = this.providerRepo.create({
      providerType,
      auth,
      address: savedAddress,
    });
    await this.providerRepo.save(provider);
    console.log('provider', provider);
   
    
    if (providerType === ProviderType.Individual) {
      await this.providerIndividualDetailsRepo.save({
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        mobileNumber: details.mobileNumber,
        provider
      });
    } else {
      await this.providerCompanyDetailsRepo.save({
        companyName: details.companyName,
        phoneNumber: details.phoneNumber,
        businessTaxNumber: details.businessTaxNumber,
        repFirstName: details.representativeFirstName,
        repLastName: details.representativeLastName,
        repEmail: details.email,
        repMobileNumber: details.mobileNumber,
        provider
      });
    }

   

    const accessToken = await this.authService.generateToken(auth.id, role);
    return { accessToken };
  }
}
