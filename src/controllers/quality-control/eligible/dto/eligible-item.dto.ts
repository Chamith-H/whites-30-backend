import { IsOptional } from 'class-validator';

export class EligibleItemDto {
  @IsOptional()
  ItemCode: any;

  @IsOptional()
  ItemName: any;
}
