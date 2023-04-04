import {IsNotEmpty,IsString, IsEmail, MinLength} from 'class-validator'
import { IsPasswordValid } from './validators/password.validator';

export class NewUserDTO {
  
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
    firstName: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
    lastName: string;
  @IsNotEmpty()
  @IsEmail()
    email: string;
  @MinLength(4)
  @IsNotEmpty()
  @IsString()
  @IsPasswordValid()
    password: string;

  role: string;
  enabled: boolean;
  hashedRefreshToken: string;

}
