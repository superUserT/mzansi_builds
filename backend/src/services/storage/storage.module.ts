import { Module } from '@nestjs/common';
import { MinioStorageService } from './minio-storage/minio-storage.service';
import { I_STORAGE_PROVIDER } from './storage.provider.interface';

@Module({
  providers: [
    {
      provide: I_STORAGE_PROVIDER,
      useClass: MinioStorageService,
    },
  ],
  exports: [I_STORAGE_PROVIDER], 
})
export class StorageModule {}