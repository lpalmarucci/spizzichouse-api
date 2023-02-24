import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { User } from '../../user/User.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
