import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { FeedGateway } from './feed.gateway';
import { Follow } from '../users/entities/follow.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow]),
    JwtModule.register({}),
  ],
  providers: [FeedGateway],
  exports: [FeedGateway],
})
export class FeedModule {}