import { IsNotEmpty } from 'class-validator';

export class EditLogDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  method: number;

  @IsNotEmpty()
  target: string;

  @IsNotEmpty()
  origin: string;

  @IsNotEmpty()
  data: any;

  @IsNotEmpty()
  successMessage: string;

  @IsNotEmpty()
  errorMessage: string;
}
