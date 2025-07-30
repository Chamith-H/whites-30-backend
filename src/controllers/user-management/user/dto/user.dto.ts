import { IsNotEmpty, IsOptional } from 'class-validator';

class TelInputDto {
  @IsNotEmpty()
  number: string;

  @IsNotEmpty()
  internationalNumber: string;

  @IsNotEmpty()
  nationalNumber: string;

  @IsNotEmpty()
  e164Number: string;

  @IsNotEmpty()
  countryCode: string;

  @IsNotEmpty()
  dialCode: string;
}

export class UserDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  dob: string;

  @IsOptional()
  houseNo: string;

  @IsOptional()
  street: string;

  @IsOptional()
  city: string;

  @IsOptional()
  state: string;

  @IsOptional()
  country: string;

  @IsOptional()
  zipCode: string;

  @IsNotEmpty()
  verificationType: string;

  @IsNotEmpty()
  verificationNumber: string;

  @IsOptional()
  gender: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  officeMobile: TelInputDto;

  @IsNotEmpty()
  officeEmail: string;

  @IsNotEmpty()
  employeeId: string;

  @IsOptional()
  status: boolean;
}
