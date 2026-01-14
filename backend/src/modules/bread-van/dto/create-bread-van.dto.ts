import {
  IsString,
  IsEnum,
  IsUrl,
  Matches,
  MinLength,
  MaxLength,
  IsNotEmpty,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Weekday } from '@prisma/client';
import { CreateBreadVanImageDto } from './create-bread-van-image.dto';

export class CreateBreadVanLocationDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsUrl()
  googleMapsUrl: string;

  // enum z Prisma – MONDAY, TUESDAY, ...
  @IsEnum(Weekday)
  dayOfTheWeek: Weekday;

  // np. "09:30" – możesz dopasować regex, jeśli używasz innego formatu
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'startTime musi być w formacie HH:MM',
  })
  startTime: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'endTime musi być w formacie HH:MM',
  })
  endTime: string;
}

export class CreateBreadVanDescriptionDto {
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  shortDescription: string;

  @IsString()
  @MinLength(200)
  @MaxLength(500)
  longDescription: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBreadVanImageDto)
  images: CreateBreadVanImageDto[];
}
