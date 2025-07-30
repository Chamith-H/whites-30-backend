import { IsNotEmpty } from 'class-validator';

export class ItemListModel {
  @IsNotEmpty()
  ItemCode: string;

  @IsNotEmpty()
  ItemName: string;
}
