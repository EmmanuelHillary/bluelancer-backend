import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ default: 'Test' })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({ default: 'User' })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({ default: 'test@mail.com' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email' })
  readonly email: string;

  @ApiProperty({ default: 'testpassword1#' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ default: '123456789' })
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly isWorker: boolean;

  @ApiProperty({ default: 'Technician', required:false })
  @IsOptional()
  @IsString()
  readonly occupation?: string;
}
