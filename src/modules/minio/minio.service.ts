import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { envVars } from 'src/common/constants/env-variables.mapping';

@Injectable()
export class MinioService {
  private s3Client: S3Client;
  private endpoint: string;
  private logger = new Logger(MinioService.name)

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get<string>(envVars.s3.endpoint) || '';
    this.s3Client = new S3Client({
      region: this.configService.get<string>(envVars.s3.region),
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: this.configService.get<string>(envVars.s3.accessKey)!,
        secretAccessKey: this.configService.get<string>(envVars.s3.secretKey)!,
      },
      forcePathStyle: true, // required for MinIO
      tls: this.configService.get<string>(envVars.s3.useSsl) === 'true',
    });
  }

  private async bucketExists(bucket: string): Promise<boolean> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
      return true;
    } catch (err) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw err;
    }
  }

  async createBucketIfNotExists(
    bucket: string,
    makePublicReadOnly = false,
  ): Promise<void> {
    if (!(await this.bucketExists(bucket))) {
      await this.s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
      this.logger.log(`Bucket "${bucket}" created`);

      if (makePublicReadOnly) {
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'PublicRead',
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        };

        await this.s3Client.send(
          new PutBucketPolicyCommand({
            Bucket: bucket,
            Policy: JSON.stringify(policy),
          }),
        );
        this.logger.log(`Public-read policy applied to "${bucket}"`);
      }
    } else {
      this.logger.log(`Bucket "${bucket}" already exists`);
    }
  }

   /** Replace (or create) swagger.json in the given bucket/key */
   async uploadSwaggerJson(
    bucket: string,
    key: string,
    buffer: Buffer,
  ): Promise<string> {
    // 1. remove old object if it exists
    try {
      await this.s3Client.send(
        new HeadObjectCommand({ Bucket: bucket, Key: key }),
      );
      await this.s3Client.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: key }),
      );
    } catch {
      /* object didn’t exist – ignore */
    }

    // 2. put the new file
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: 'application/json',
      }),
    );

    // 3. return a public-ish URL (adjust for your endpoint)
    const url = new URL(`${bucket}/${key}`, this.endpoint).toString();
    this.logger.log(url);
    return url;
  }

  async uploadFile(
    bucket: string,
    key: string,
    body: Buffer,
    contentType: string,
  ) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    await this.s3Client.send(command);

    const url = new URL(`${bucket}/${key}`, this.endpoint).toString();

    return url;
  }

  async deleteFile(bucket: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await this.s3Client.send(command);
  }
}
