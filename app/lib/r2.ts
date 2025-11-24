import { S3Client, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import https from "https";

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  requestHandler: new NodeHttpHandler({
    httpsAgent: new https.Agent({
      keepAlive: true,
      maxSockets: 50,
    }),
    connectionTimeout: 30_000,
    socketTimeout: 300_000,
  }),
  maxAttempts: 3,
});

export async function writeR2(
  file : Buffer | Uint8Array | Blob | string,
  fileName : string,
  folder : string,
  contentType : string,
) {
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

    const uploader = new Upload({
      client: R2,
      params: {
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      },
      partSize: 5 * 1024 * 1024, // 5 MB
      leavePartsOnError: false,
    });
    await uploader.done();

    return key;
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

export async function urlR2(key: string, expiresIn: number): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(R2, command, { expiresIn });
}