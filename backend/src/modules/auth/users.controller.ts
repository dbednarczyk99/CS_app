import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { OWNER_ROLES, Roles } from './auth.decorators';
import type { StaffRequest } from './auth.guard';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

/** Konta panelu – tylko właściciel */
@Roles(...OWNER_ROLES)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: StaffRequest,
  ) {
    return this.service.update(id, dto, req.user!.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: StaffRequest) {
    return this.service.remove(id, req.user!.sub);
  }
}
