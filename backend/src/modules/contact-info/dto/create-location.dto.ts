import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateLocationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  address: string;

  @IsString()
  googleMapsUrl: string;

  @IsString()
  openingHours: string;

  @IsUUID()
  contactId: string;
}
