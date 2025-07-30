import { IsOptional } from 'class-validator';

export class FilterRoleDto {
  // searchable name is any type to convert REGEX
  @IsOptional()
  name: any;

  @IsOptional()
  status: boolean;
}
