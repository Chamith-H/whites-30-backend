import { IsNotEmpty } from 'class-validator';

export class SaveDataDto {
  @IsNotEmpty()
  data: any[];
}
