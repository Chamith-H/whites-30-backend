import { IsNotEmpty } from 'class-validator';

export class StartInspectionDto {
  @IsNotEmpty()
  stageName: string;

  @IsNotEmpty()
  docNum: string;

  @IsNotEmpty()
  itemCode: string;

  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  sampleCount: number;
}
