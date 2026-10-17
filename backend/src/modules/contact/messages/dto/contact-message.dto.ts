import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length, MaxLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

/** Wiadomość z formularza na stronie „Kontakt” */
export class ContactMessageDto {
  @Transform(trim)
  @IsString()
  @Length(2, 100, { message: 'Podaj imię (2–100 znaków)' })
  name: string;

  @Transform(trim)
  @IsEmail({}, { message: 'Podaj poprawny adres e-mail' })
  @MaxLength(200)
  email: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'Temat może mieć najwyżej 150 znaków' })
  subject?: string;

  @Transform(trim)
  @IsString()
  @Length(5, 3000, { message: 'Wiadomość musi mieć od 5 do 3000 znaków' })
  message: string;

  /** pole-pułapka na boty – ukryte na stronie, musi zostać puste */
  @IsOptional()
  @IsString()
  website?: string;
}
