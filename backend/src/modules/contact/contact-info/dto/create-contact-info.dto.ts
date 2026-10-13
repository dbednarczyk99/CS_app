import { MinLength, IsString, IsEnum, IsOptional } from 'class-validator';
import { ContactType } from '@prisma/client';

export class CreateContactInfoDto {
  @IsEnum(ContactType)
  type: ContactType;

  @IsOptional()
  @IsString()
  label?: string;

  @MinLength(3)
  @IsString()
  value: string;
}
