import { Controller, Get } from '@nestjs/common';

@Controller('debug')
export class DebugController {
  @Get('ping')
  ping() {
    console.log('🔥 DEBUG /debug/ping handler');
    return { ok: true };
  }
}
