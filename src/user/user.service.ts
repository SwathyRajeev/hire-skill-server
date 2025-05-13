import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service'; // import AuthService
import { CreateUserDto } from './dto/user.dto';
import { Repository } from 'typeorm';
import { Address } from 'src/common/entities/address.entity';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth, Role } from 'src/auth/entities/auth.entity';
import * as byCrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Auth)
    private authRepo: Repository<Auth>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Address)
    private addressRepo: Repository<Address>,

    private authService: AuthService, // inject AuthService
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const { username, password, address, ...userDetails } = createUserDto;

    const existing = await this.authRepo.findOne({ where: { username } });
    if (existing) {
      throw new BadRequestException('Username already exists');
    }

    const salt = await byCrypt.genSalt();
    const hashedPassword = await byCrypt.hash(password, salt);

    const auth = this.authRepo.create({
      username,
      password: hashedPassword,
      salt,
      role: Role.User,
    });
    await this.authRepo.save(auth);

    const savedAddress = this.addressRepo.create(address);
    await this.addressRepo.save(savedAddress);

    const user = this.userRepo.create({
      ...userDetails,
      address: savedAddress,
      auth,
    });
    await this.userRepo.save(user);

    const accessToken = await this.authService.generateToken(
      auth.id,
      auth.role,
    );
    return { accessToken };
  }
}
