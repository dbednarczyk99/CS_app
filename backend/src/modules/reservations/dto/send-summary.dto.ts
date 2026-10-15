import { IsEmail, IsOptional, Matches } from 'class-validator';

export class SendSummaryDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Nieprawidłowa data' })
  date: string;

  /** domyślnie SUMMARY_EMAIL z konfiguracji */
  @IsOptional()
  @IsEmail()
  to?: string;
}
