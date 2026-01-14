import { PartialType } from '@nestjs/mapped-types';
import { CreateBreadVanImageDto } from './create-bread-van-image.dto';

export class UpdateProductImageDto extends PartialType(
  CreateBreadVanImageDto,
) {}
