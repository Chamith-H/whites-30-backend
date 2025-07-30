import { IsNotEmpty, IsOptional } from 'class-validator';

export class InspectionDto {
  @IsOptional()
  stage: string;

  @IsNotEmpty()
  DocNum: any;

  @IsNotEmpty()
  ItemCode: any;

  @IsNotEmpty()
  U_Approval: any;
}
