import { IsNotEmpty } from 'class-validator';

export class FilterEquipmentDto {
  @IsNotEmpty()
  name: any;

  @IsNotEmpty()
  code: any;
}
