import { BadRequestException, Injectable } from '@nestjs/common';
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

    if (!user) throw new BadRequestException('User not found');

    if (!bcrypt.compareSync(pass, user.password)) {
      throw new BadRequestException('Password is wrong');
    }
    const payload = { sub: user.id, username: user.username };
    const token = this._jwtService.sign(payload, {
      secret: this._jwtSettings.jwtSecret,
      expiresIn: this._jwtSettings.jwtExpiration,
    });
    const expirationDate = this.getExpirationTime(token);
    return {
      access_token: token,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      expiresIn: expirationDate,
    };
  }

  getExpirationTime(token: string): number | null {
    try {
      const decodedToken: any = this._jwtService.verify(token, {
        secret: this._jwtSettings.jwtSecret,
      });
      if (decodedToken && decodedToken.exp) {
        return decodedToken.exp; // Convert from seconds to milliseconds
      }
    } catch (error) {
      console.error('Error decoding token:', error.message);
    }

    return null;
  }

  async updateUserPassword(userId: number, password: string) {
    return this._userService.update(userId, { password });
  }
}
