import { IsNotEmpty } from 'class-validator';

export class SampleDto {
  @IsNotEmpty()
  stage: string;

  @IsNotEmpty()
  itemCode: string;

  @IsNotEmpty()
  docNum: string;

  @IsNotEmpty()
  round: number;

  @IsNotEmpty()
  parameterValues: any;
}
