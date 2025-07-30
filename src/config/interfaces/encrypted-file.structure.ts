export interface EncryptedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface UploadingImages {
  images: EncryptedFile[];
}
