import { Role } from "../entities/auth.entity";

export interface JwtPayload {
  userId: string;
  role: Role;
}
