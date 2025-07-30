import { IsOptional, IsNotEmpty } from 'class-validator';

export class ItemDto {
  @IsNotEmpty()
  category: string[];

  @IsNotEmpty()
  seq: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  group: number;

  @IsNotEmpty()
  uomGroup: number;

  @IsNotEmpty()
  invMethod: string;

  @IsNotEmpty()
  valMethod: string;

  @IsNotEmpty()
  planMethod: string;

  @IsNotEmpty()
  procumentMethod: string;

  @IsNotEmpty()
  issueMethod: string;

  @IsOptional()
  status: boolean;
}
