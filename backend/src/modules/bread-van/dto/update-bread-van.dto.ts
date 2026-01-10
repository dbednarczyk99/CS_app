import { PartialType } from '@nestjs/mapped-types';
import {
  CreateBreadVanDescriptionDto,
  CreateBreadVanLocationDto,
} from './create-bread-van.dto';

export class UpdateBreadVanDescriptionDto extends PartialType(
  CreateBreadVanDescriptionDto,
) {}

export class UpdateBreadVanLocationDto extends PartialType(
  CreateBreadVanLocationDto,
) {}
