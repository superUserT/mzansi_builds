export const I_STORAGE_PROVIDER = 'IStorageProvider';

export interface IStorageProvider {
  uploadFile(fileName: string, fileBuffer: Buffer, mimeType: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<boolean>;
}