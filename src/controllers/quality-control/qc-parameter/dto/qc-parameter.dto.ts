import { IsNotEmpty } from 'class-validator';

export class QcParameterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  uom: string;

  @IsNotEmpty()
  equipment: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  type: string;
}
