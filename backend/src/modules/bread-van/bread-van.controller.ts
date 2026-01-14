import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { BreadVanService } from './bread-van.service';
import {
  CreateBreadVanLocationDto,
  //CreateBreadVanDescriptionDto, opcjonalnie, jeśli kiedyś jednak będziesz chciał POST
} from './dto/create-bread-van.dto';
import {
  UpdateBreadVanLocationDto,
  UpdateBreadVanDescriptionDto,
} from './dto/update-bread-van.dto';

@Controller('bread-van')
export class BreadVanController {
  constructor(private readonly service: BreadVanService) {}

  // ===== LOCATIONS =====

  // wszystkie lokalizacje busa (max 7 – po jednym na dzień tygodnia)
  @Get('locations')
  findAllLocations() {
    return this.service.findAllLocations();
  }

  @Get('locations/:id')
  findOneLocation(@Param('id') id: string) {
    return this.service.findOneLocation(id);
  }

  // nowa lokalizacja busa na konkretny dzień tygodnia
  @Post('locations')
  createLocation(@Body() body: CreateBreadVanLocationDto) {
    return this.service.createLocation(body);
  }

  // edycja istniejącej lokalizacji (np. zmiana godzin / adresu / dnia tygodnia)
  @Patch('locations/:id')
  editLocation(
    @Param('id') id: string,
    @Body() body: UpdateBreadVanLocationDto,
  ) {
    return this.service.editLocation(id, body);
  }

  // usunięcie lokalizacji busa (np. już nie jeździ w dany dzień)
  @Delete('locations/:id')
  removeLocation(@Param('id') id: string) {
    return this.service.removeLocation(id);
  }

  // ===== DESCRIPTION (JEDEN REKORD) =====

  // pobranie JEDYNEGO opisu busa (z obrazkami)
  @Get('description')
  getDescription() {
    return this.service.getDescription();
  }

  // edycja istniejącego opisu (bez tworzenia/usuwania)
  @Patch('description')
  updateDescription(@Body() body: UpdateBreadVanDescriptionDto) {
    return this.service.updateDescription(body);
  }
}
