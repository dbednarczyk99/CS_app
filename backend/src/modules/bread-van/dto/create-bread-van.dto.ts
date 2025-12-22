import { IsString } from 'class-validator';

export class CreateBreadVanDto {
  @IsString()
  address: string;

  @IsString()
  googleMapsUrl: string;

  @IsString()
  dayOfTheWeek: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}
