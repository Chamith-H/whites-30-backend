import { IsNotEmpty } from 'class-validator';

export class StartingObserverDto {
  @IsNotEmpty()
  stageName: string;

  @IsNotEmpty()
  docNum: string;

  @IsNotEmpty()
  itemCode: string;

  @IsNotEmpty()
  round: number;
}
