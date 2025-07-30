import { IsOptional } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  permissions: string[];
}
