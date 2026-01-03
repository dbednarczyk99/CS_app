import { MinLength, IsString } from 'class-validator';

export class CreateContactInfoDto {
  @IsString()
  type: string;

  @IsString()
  @MinLength(5)
  label: string;

  @MinLength(3)
  @IsString()
  value: string;
}
