import { IsOptional } from 'class-validator';

export class FilterGAtePassDto {
  @IsOptional()
  driverName: any;

  @IsOptional()
  driverNic: any;

  @IsOptional()
  po: number;

  @IsOptional()
  vehicleType: string;

  @IsOptional()
  vehicleNumber: any;
  
  @IsOptional()
  state: string;
}
