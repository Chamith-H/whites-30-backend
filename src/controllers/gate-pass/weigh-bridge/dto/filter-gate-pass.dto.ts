import { IsOptional } from 'class-validator';

export class FilterGatePassDto {
  @IsOptional()
  gatePassId: any;

  @IsOptional()
  po: any;

  @IsOptional()
  itemCode: any;
}
