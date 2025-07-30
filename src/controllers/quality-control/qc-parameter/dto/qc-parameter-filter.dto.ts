import { IsNotEmpty } from 'class-validator';

export class FilterQcParameterDto {
  @IsNotEmpty()
  name: any;

  @IsNotEmpty()
  code: any;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  type: string;
}
