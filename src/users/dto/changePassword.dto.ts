import {
    ArrayNotEmpty,
    IsOptional,
    IsEmail,
    IsMongoId,
    Matches,
    IsDefined,
    IsString,
    IsNotEmpty,
    equals
  } from 'class-validator';
  
  
  export class ChangePasswordDto {
      @IsNotEmpty()
      @IsString()
      password: string;
  
      @IsNotEmpty()
      @IsString()
      new_password: string;
  
  
      @IsNotEmpty()
      @IsString()
      reEnterNewpassword: string;
  
  }