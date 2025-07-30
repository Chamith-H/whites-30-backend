import { IsOptional } from 'class-validator';

export class FilterPoDto {
  @IsOptional()
  docNum: number;
}
