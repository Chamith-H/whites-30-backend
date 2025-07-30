import { IsNotEmpty } from 'class-validator';

export class ItemParameterDto {
  @IsNotEmpty()
  stage: string;

  @IsNotEmpty()
  itemCode: string;

  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  sampleCount: string;

  @IsNotEmpty()
  parameterLines: any[];
}
