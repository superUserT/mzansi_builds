import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { FeedModule } from './modules/feed/feed.module';
import { DatabaseModule } from './services/database/database.module';
import { StorageModule } from './services/storage/storage.module';
import { MailModule } from './services/mail/mail.module';

@Module({
  imports: [AuthModule, UsersModule, ProjectsModule, FeedModule, DatabaseModule, StorageModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
