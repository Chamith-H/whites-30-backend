import { IsOptional } from 'class-validator';

export class FilterUserDto {
  // searchable name is any type to convert REGEX
  @IsOptional()
  name: any;

  @IsOptional()
  status: boolean;
}
