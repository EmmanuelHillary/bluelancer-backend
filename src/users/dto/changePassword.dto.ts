import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsOptional,
  IsEmail,
  IsMongoId,
  Matches,
  IsDefined,
  IsString,
  IsNotEmpty,
  equals,
} from 'class-validator';

export class ChangePasswordDto {

  @ApiProperty({ required:true, default:"testpassword1#" })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ required:true, default:"newPassword1#" })
  @IsNotEmpty()
  @IsString()
  new_password: string;

  @ApiProperty({ required:true, default:"newPassword1#" })
  @IsNotEmpty()
  @IsString()
  reEnterNewpassword: string;
}
