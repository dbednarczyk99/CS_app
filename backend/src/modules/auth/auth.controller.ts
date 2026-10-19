import { Body, Controller, Get, Ip, Patch, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/user.dto';
import { Public } from './auth.decorators';
import type { StaffRequest } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('login')
  // limit prób liczony po adresie połączenia (nie po X-Forwarded-For, który klient może podać sam)
  login(@Body() body: LoginDto, @Ip() ip: string) {
    return this.service.login(body, ip);
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
