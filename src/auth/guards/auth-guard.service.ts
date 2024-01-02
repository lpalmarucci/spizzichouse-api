import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly _jwtSecret: string;

  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _reflector: Reflector,
  ) {
    this._jwtSecret = this._configService.get<string>('config.crypt.jwtSecret');
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this._reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;

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
      return false;
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
