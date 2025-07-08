import { IsString, IsNumber, IsDateString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateDepartureDto {
  @IsNumber()
  @IsNotEmpty()
  stationId: number;

  @IsString()
  @IsNotEmpty()
  direction: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledDepartureUtc: string;

  @IsDateString()
  @IsOptional()
  estimatedDepartureUtc?: string;
}
