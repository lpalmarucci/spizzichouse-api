import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ICryptConfig } from '@/config/types';

@Injectable()
export class AuthService {
  private readonly _jwtSettings: ICryptConfig;
  constructor(
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
  ) {
    this._jwtSettings = this._configService.get<ICryptConfig>('config.crypt');
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this._userService.getByUsername(username);

    if (!bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this._jwtService.sign(payload),
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      expiresIn: this._jwtSettings.jwtExpiration,
    };
  }
}
