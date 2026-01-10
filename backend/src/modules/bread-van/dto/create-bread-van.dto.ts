import {
  IsString,
  IsEnum,
  IsUrl,
  Matches,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { Weekday } from '@prisma/client';

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
}
