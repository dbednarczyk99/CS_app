import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/auth/auth.decorators';

@Public()
@Controller('debug')
export class DebugController {
  @Get('ping')
  ping() {
    console.log('🔥 DEBUG /debug/ping handler');
    return { ok: true };
  }
}
