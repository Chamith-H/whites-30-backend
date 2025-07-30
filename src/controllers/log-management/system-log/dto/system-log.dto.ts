import { IsNotEmpty } from 'class-validator';

export class SystemLogDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  target: string;

  @IsNotEmpty()
  data: any;

  @IsNotEmpty()
  successMessage: string;

  @IsNotEmpty()
  errorMessage: string;
}
