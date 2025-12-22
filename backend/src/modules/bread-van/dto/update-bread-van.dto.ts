import { PartialType } from '@nestjs/mapped-types';
import { CreateBreadVanDto } from './create-bread-van.dto';

export class UpdateBreadVanDto extends PartialType(CreateBreadVanDto) {}
