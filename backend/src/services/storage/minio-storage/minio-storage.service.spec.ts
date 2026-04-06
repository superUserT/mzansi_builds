import { Test, TestingModule } from '@nestjs/testing';
import { MinioStorageService } from './minio-storage.service';

import { ConfigService } from '@nestjs/config';

describe('MinioStorageService', () => {
  let service: MinioStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MinioStorageService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue: any) => defaultValue),
          },
        },
      ],
    }).compile();

    service = module.get<MinioStorageService>(MinioStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});