import { IsNotEmpty } from 'class-validator';

export class StartingConfDto {
  @IsNotEmpty()
  stageName: string;

  @IsNotEmpty()
  itemCode: any;
}
