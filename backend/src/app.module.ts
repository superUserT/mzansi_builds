import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { FeedModule } from './modules/feed/feed.module';

// Services
import { DatabaseModule } from './services/database/database.module';
import { StorageModule } from './services/storage/storage.module';
import { MailModule } from './services/mail/mail.module';

@Module({
  imports: [
    // 1. ConfigModule MUST be first so environment variables are available globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // 2. Infrastructure Services
    DatabaseModule,
    StorageModule,
    MailModule,

    // 3. Feature Modules
    AuthModule,
    UsersModule,
    ProjectsModule,
    FeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}