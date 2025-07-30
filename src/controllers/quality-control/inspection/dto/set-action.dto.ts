import { IsNotEmpty } from 'class-validator';

export class SetActionDto {
  @IsNotEmpty()
  U_Approval: string;

  @IsNotEmpty()
  U_ActionedWarehouse: string;

  @IsNotEmpty()
  U_ActionedNote: string;
}
