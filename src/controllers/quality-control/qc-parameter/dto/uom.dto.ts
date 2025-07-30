import { IsNotEmpty } from 'class-validator';

export class UomDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;
}
