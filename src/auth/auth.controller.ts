import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from '@/auth/dto/Login.dto';
import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@/auth/guards/auth-guard.service';
import { Public } from '@/common/decorators/public.decorator';
import { RequestUser } from '@/common/types/RequestUser.types';
import { UpdatePasswordDto } from '@/auth/dto/UpdatePassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this._authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(@Request() req: RequestUser, @Body() body: UpdatePasswordDto) {
    return this._authService.updateUserPassword(req.user.sub, body.password);
  }
}
