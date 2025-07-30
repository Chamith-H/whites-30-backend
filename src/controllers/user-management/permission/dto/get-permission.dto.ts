import { IsOptional } from 'class-validator';

export class GetPermissionDto {
  @IsOptional()
  module: number;

  @IsOptional()
  section: number;
}
