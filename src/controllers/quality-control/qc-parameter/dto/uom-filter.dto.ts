import { IsNotEmpty } from 'class-validator';

export class FilterUomDto {
  @IsNotEmpty()
  name: any;

  @IsNotEmpty()
  code: any;
}
