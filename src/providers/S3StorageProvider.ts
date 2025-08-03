import { randomUUID } from 'crypto';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import slugify from 'slugify';

const {
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

export class S3StorageProvider {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: AWS_REGION as string,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID as string,
        secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
      },
    });
  }

  async upload({
    buffer,
    originalname,
    mimetype,
  }: Express.Multer.File): Promise<string> {
    const filenameKey = `${randomUUID()}-${slugify(originalname)}`;

    const uploadParams = {
      Bucket: AWS_S3_BUCKET_NAME,
      Body: buffer,
      Key: filenameKey,
      ContentType: mimetype,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));

    return filenameKey;
  }

  async delete(key: string): Promise<boolean> {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: AWS_S3_BUCKET_NAME, Key: key })
    );

    return true;
  }
}
