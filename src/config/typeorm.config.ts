import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const options = {
      type: this.configService.get('DB_CONNECTION'),
      host: this.configService.get('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
      entities: ['dist/**/entities/*.entity{.ts,.js}'],
      synchronize: this.configService.get('DB_SYNCHRONIZE'),
      logging: false,
      ssl:
        this.configService.get('DB_SSL') === 'true'
          ? { rejectUnauthorized: false }
          : false,
      extra: {
        max: this.configService.get<number>('DB_POOL_MAX') || 10,
        min: this.configService.get<number>('DB_POOL_MIN') || 1,
        idleTimeoutMillis:
          this.configService.get<number>('DB_POOL_IDLE_TIMEOUT') || 30000,
      },
    } as TypeOrmModuleOptions;

    console.log(
      `Connected to ${this.configService.get('DB_HOST')}/${this.configService.get('DB_USERNAME')}/${this.configService.get('DB_DATABASE')}`,
    );

    return options;
  }
}
