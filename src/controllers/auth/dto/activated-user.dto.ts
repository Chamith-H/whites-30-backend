import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ActivatedUserDto {
  @IsNotEmpty()
  @IsString()
  userId: any;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  roleId: any;

  @IsNotEmpty()
  @IsString()
  roleName: any;

  @IsOptional()
  profileImage: string;
}
