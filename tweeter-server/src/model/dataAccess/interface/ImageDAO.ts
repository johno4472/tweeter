export interface ImageDAO {
  putImage(fileName: string, imageBytes: Uint8Array): Promise<string>;
}
