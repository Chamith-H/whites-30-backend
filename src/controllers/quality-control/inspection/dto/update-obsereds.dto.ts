import { IsNotEmpty } from 'class-validator';

export class ObservedValuesDto {
  @IsNotEmpty()
  stageName: string;

  @IsNotEmpty()
  docNum: string;

  @IsNotEmpty()
  itemCode: string;

  @IsNotEmpty()
  line: number;

  @IsNotEmpty()
  obsData: any[];
}
