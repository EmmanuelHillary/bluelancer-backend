// ../users/dto/service-details.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsPositive, Min, Max } from 'class-validator';

export class ServiceDetailsDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  occupation: string;

  @IsNotEmpty()
  @IsString()
  openingTime: string;

  @IsNotEmpty()
  @IsString()
  closingTime: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0)
  minPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(999999)
  maxPrice: number;
}
