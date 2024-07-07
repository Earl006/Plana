// services/fileUploadService.ts
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

export async function uploadFile(file: Express.Multer.File): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  
  await fs.writeFile(filePath, file.buffer);
  
  return `/uploads/${fileName}`;
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const fileName = path.basename(fileUrl);
  const filePath = path.join(UPLOAD_DIR, fileName);
  
  await fs.unlink(filePath);
}