import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {

  @ApiProperty({ default:"test@mail.com"})
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email' })
  readonly email: string;

  @ApiProperty({ default:"testpassword1#"})
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
