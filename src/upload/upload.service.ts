import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });

    try {
      const bucketName = 'blackbook-coverimg-bucket';
      const objectName = `${Date.now() + file.originalname}`;

      await new AWS.S3()
        .putObject({
          Bucket: bucketName,
          Body: file.buffer,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();

      return `https://${bucketName}.s3.amazonaws.com/${objectName}`;
    } catch (error) {
      return;
    }
  }

  async deleteFile(bucket: string, key: string) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });
    try {
      await new AWS.S3()
        .deleteObject({
          Bucket: bucket,
          Key: key,
        })
        .promise();
    } catch (error) {
      console.log(error);
    }
  }
}
