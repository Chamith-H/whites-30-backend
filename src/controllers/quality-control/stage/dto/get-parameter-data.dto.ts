import { IsNotEmpty } from 'class-validator';

export class GetParameterDataDto {
  @IsNotEmpty()
  stage: string;

  @IsNotEmpty()
  itemCode: any;
}
