import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateStationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  ptvStationId: number;
}
