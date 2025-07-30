import { IsOptional } from 'class-validator';

export class EligibleWarehouseDto {
  @IsOptional()
  WarehouseCode: any;

  @IsOptional()
  WarehouseName: any;
}
