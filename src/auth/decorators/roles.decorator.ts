import { SetMetadata } from '@nestjs/common';
import { Role } from '../entities/auth.entity';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
