import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { Public } from './auth.decorators';
import { ClientIp } from './client-ip';
import type { StaffRequest } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('login')
  // limit prób liczony po adresie połączenia (nagłówkom adresu ufamy tylko z sekretem – ClientIp)
  login(@Body() body: LoginDto, @ClientIp() ip: string) {
    return this.service.login(body, ip);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() dto: ForgotPasswordDto, @ClientIp() ip: string) {
    return this.service.forgotPassword(dto, ip);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(200)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.service.resetPassword(dto);
  }

  // zalogowany pracownik: własne konto i zmiana hasła (konta innych – UsersController, tylko właściciel)
  @Get('me')
  me(@Req() req: StaffRequest) {
    return this.service.me(req.user!.sub);
  }

  @Patch('me/password')
  changePassword(@Body() dto: ChangePasswordDto, @Req() req: StaffRequest) {
    return this.service.changePassword(req.user!.sub, dto);
  }
}
