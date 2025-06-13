/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: 'Password has to be between 3 and 20 characters',
  })
  public password: string;
  @IsString()
  @Length(3, 20, {
    message: 'Password has to be between 3 and 20 characters',
  })
  confirmPassword: string;
  name: string; 
  phoneNumber: string;
  bio?: string;
  location?: string;
  website?: string;
  offerSkills?: string[];
  wantSkills?: string[];
}
