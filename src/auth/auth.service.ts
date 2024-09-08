import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

export interface IUserRepository {
  createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>;
  findByUsername(username: string): Promise<User | null>;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = await this.userRepository.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'Success';
    }

    throw new UnauthorizedException('Please check your login credentials');
  }
}
