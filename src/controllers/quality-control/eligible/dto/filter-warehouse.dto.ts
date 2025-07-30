import { IsNotEmpty } from 'class-validator';

export class FilterWarehouseDto {
  @IsNotEmpty()
  U_RejectWH: string;
}
