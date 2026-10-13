import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public, Roles } from './auth.decorators';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Roles(Role.ADMIN)
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.service.register(body);
  }

  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.service.login(body);
  }
}
