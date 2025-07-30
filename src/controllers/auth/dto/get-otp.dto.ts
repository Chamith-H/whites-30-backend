import { IsNotEmpty, IsString } from 'class-validator';

export class GetOtpDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
