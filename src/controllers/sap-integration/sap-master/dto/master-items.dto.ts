import { IsNotEmpty, IsOptional } from 'class-validator';

export class MasterItemsDto {
  @IsNotEmpty()
  ItemType: string;

  @IsNotEmpty()
  ItemsGroupCode: number;

  @IsNotEmpty()
  UoMGroupEntry: number;

  @IsNotEmpty()
  GLMethod: string;

  @IsNotEmpty()
  CostAccountingMethod: string;

  @IsNotEmpty()
  PlanningSystem: string;

  @IsNotEmpty()
  ProcurementMethod: string;

  @IsNotEmpty()
  IssueMethod: string;
}
