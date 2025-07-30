import { IsNotEmpty, IsOptional } from 'class-validator';

export class WeightRecordDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  firstWeight: number;

  @IsOptional()
  secondWeight: number;
}
