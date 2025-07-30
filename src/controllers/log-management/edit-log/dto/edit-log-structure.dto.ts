export interface EditLogStructure {
  userId: string;
  method: number;
  target: string;
  origin: string;
  data: any;
  successMessage: string;
  errorMessage: string;
}
