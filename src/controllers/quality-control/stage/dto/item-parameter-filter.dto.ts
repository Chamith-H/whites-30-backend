import { IsNotEmpty } from 'class-validator';

export class FilterItemParameterDto {
  @IsNotEmpty()
  stage: string;

  @IsNotEmpty()
  itemCode: any;

  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  sampleCount: string;
}
