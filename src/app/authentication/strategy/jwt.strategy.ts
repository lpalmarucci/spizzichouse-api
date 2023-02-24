import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthenticationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: any,
    done: VerifiedCallback,
  ): Promise<any> {
    const token = req.headers['authorization'].split(' ').at(1);
    const sameToken = await this.authService.validateRequestTokenByUser(
      payload.sub,
      token,
    );
    if (!sameToken) return done(new UnauthorizedException());
    return done(null, { userId: payload.sub, username: payload.username });
  }
}
