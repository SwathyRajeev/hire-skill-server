import { Module } from '@nestjs/common';
import { Address } from './entities/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
     imports: [TypeOrmModule.forFeature([Address])]
})
export class CommonModule {}
