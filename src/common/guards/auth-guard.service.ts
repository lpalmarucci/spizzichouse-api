import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly _jwtSecret: string;

  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {
    this._jwtSecret = this._configService.get<string>('config.crypt.jwtSecret');
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token)
      throw new UnauthorizedException('No authorization token provided');

    try {
      request['user'] = await this._jwtService.verifyAsync(token, {
        secret: this._jwtSecret,
      });
    } catch (e) {
      console.error(
        'An error occurred while validating jwt passing in the Authorization header',
      );
      console.error(e.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
