import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { envVars } from 'src/common/constants/env-variables.mapping';

@Injectable()
export class MinioService {
  private s3Client: S3Client;
  private endpoint: string;

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
