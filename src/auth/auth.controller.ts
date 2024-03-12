import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { Public } from '@/common/decorators/public.decorator';
import { RequestUser } from '@/common/types/RequestUser.types';
import { UpdatePasswordDto } from '@/auth/dto/UpdatePassword.dto';
import { GoogleOAuthGuard } from '@/auth/guards/GoogleOauth.guard';
import { Response as ResponseType } from 'express';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _configService: ConfigService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@Request() req: RequestUser) {
    return this._authService.login(req.user);
    // return this._authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(@Request() req: RequestUser, @Body() body: UpdatePasswordDto) {
    return this._authService.updateUserPassword(req.user.sub, body.password);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Public()
  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(
    @Request() req: RequestUser,
    @Response() res: ResponseType,
  ) {
    try {
      if (!req.user) throw new UnauthorizedException('Not authenticated');
      res.redirect(this._configService.get<string>('auth.redirectUrl'));
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  }
}
