import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { IStorageProvider } from '../storage.provider.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MinioStorageService implements IStorageProvider {
  private readonly logger = new Logger(MinioStorageService.name);
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(this.configService.get<string>('MINIO_PORT', '9000'), 10),
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
    });

    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME', 'mzansi-profiles');
  }

  async uploadFile(fileName: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
      }

      const uniqueFileName = `${uuidv4()}-${fileName.replace(/\s+/g, '-')}`;

      await this.minioClient.putObject(this.bucketName, uniqueFileName, fileBuffer, undefined, {
        'Content-Type': mimeType,
      });

      this.logger.log(`File uploaded successfully: ${uniqueFileName}`);

      const endPoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
      const port = this.configService.get<string>('MINIO_PORT', '9000');
      return `http://${endPoint}:${port}/${this.bucketName}/${uniqueFileName}`;
      
    } catch (error) {
      this.logger.error('Error uploading file to MinIO', error);
      throw new InternalServerErrorException('Could not upload file');
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const fileName = fileUrl.split('/').pop();
      if (fileName) {
        await this.minioClient.removeObject(this.bucketName, fileName);
      }
      return true;
    } catch (error) {
      this.logger.error('Error deleting file', error);
      return false;
    }
  }
}