import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { Milestone } from './entities/milestone.entity';
import { Comment } from './entities/comment.entity'; 
import { CollaborationRequest } from './entities/collaboration-request.entity'; 
import { MailModule } from '../../services/mail/mail.module'; 
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Milestone, Comment, CollaborationRequest]), MailModule, UsersModule], 
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}