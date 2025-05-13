import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Address } from 'src/common/entities/address.entity';
import { ProviderCompanyDetails } from './entities/provider-company.entity';
import { ProviderIndividualDetails } from './entities/provider-individual.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Provider,
      Auth,
      Address,
      ProviderCompanyDetails,
      ProviderIndividualDetails,
    ]),
    AuthModule,
  ],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
