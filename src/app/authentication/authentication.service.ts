import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../user/User.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: User): Promise<{ access_token: string }> {
    const { access_token } = await this.generateToken(user);

    await this.userRepository.update(
      { userId: user.userId },
      { token: access_token },
    );
    return { access_token };
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new HttpException('User not found', HttpStatus.FORBIDDEN);
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (user && isSamePassword) {
      return user;
    }
    return null;
  }

  async generateToken(user: User) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(user: User): Promise<{ affected: number }> {
    const { affected }: UpdateResult = await this.userRepository.update(
      { userId: user.userId },
      { token: null },
    );
    return { affected };
  }

  async validateRequestTokenByUser(userId: string, token: string) {
    const user = await this.userService.findById(userId);
    return user.token == token;
  }
}
