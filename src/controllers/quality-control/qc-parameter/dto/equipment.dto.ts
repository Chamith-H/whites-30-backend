import { IsNotEmpty } from 'class-validator';

export class EquipmentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;
}
