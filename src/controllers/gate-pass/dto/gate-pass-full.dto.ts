import { IsNotEmpty, IsOptional } from 'class-validator';

export class GatePassFullDto {
  @IsNotEmpty()
  driverName: string;

  @IsNotEmpty()
  driverNic: string;

  @IsNotEmpty()
  driverLicense: string;

  @IsNotEmpty()
  driverMobile: any;

  @IsNotEmpty()
  vehicleType: string;

  @IsNotEmpty()
  vehicleNumber: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  po: number;

  @IsNotEmpty()
  lineItems: any[];
}
