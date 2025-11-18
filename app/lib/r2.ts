import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

interface UploadFileParams {
  file: Buffer | Uint8Array | Blob | string;
  fileName: string;
  folder: string;
  bucketName: string;
  contentType?: string;
}

export async function writeR2({
  file,
  fileName,
  folder,
  contentType, // image/jpeg or application/pdf
}: UploadFileParams): Promise<{ key: string; url: string }> {
  try {
    const sanitizedFolder = folder.replace(/^\/+|\/+$/g, '');
    const sanitizedFileName = fileName.replace(/^\/+/g, '');
    const key = `${sanitizedFolder}/${sanitizedFileName}`;
    
    let fileBuffer: Buffer;
    if (file instanceof Blob)
      fileBuffer = Buffer.from(await file.arrayBuffer());
    else if (typeof file === 'string')
      fileBuffer = Buffer.from(file);
    else
      fileBuffer = file as Buffer;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });
    await R2.send(command);

    const url = `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${key}`;

    return { key, url };
  } catch (error) {
    console.error('Error uploading file to R2:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteR2(key: string): Promise<{ success: boolean }> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    await R2.send(command);

    return { success: true };
  } catch (error) {
    console.error('Error deleting file from R2:', error);
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}