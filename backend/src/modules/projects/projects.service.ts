import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Milestone } from './entities/milestone.entity';
import { Comment } from './entities/comment.entity';
import { CollaborationRequest } from './entities/collaboration-request.entity';
import { User } from '../../modules/users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { AddMilestoneDto } from './dto/add-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from '../../services/mail/mail.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Milestone)
    private readonly milestoneRepository: Repository<Milestone>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CollaborationRequest)
    private readonly collabRepository: Repository<CollaborationRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
    private readonly mailService: MailService,
  ) {}

  async getCelebrationWall(): Promise<Project[]> {
    return this.projectRepository.find({
      where: { isCompleted: true },
      order: { completedAt: 'DESC' },
      relations: ['user'], 
    });
  }

  // --- CORE PROJECT LOGIC ---
  async create(userId: string, createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      user: { id: userId },
    });
    const savedProject = await this.projectRepository.save(project);
    
    this.eventEmitter.emit('project.created', {
      projectId: savedProject.id,
      title: savedProject.title,
      userId: userId,
      timestamp: new Date(),
    });

    return savedProject;
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async markAsCompleted(userId: string, projectId: string): Promise<Project> {
    const project = await this.findOne(projectId);

    if (project.user.id !== userId) {
      throw new UnauthorizedException('You can only complete your own projects');
    }

    project.isCompleted = true;
    project.completedAt = new Date(); 
    const updatedProject = await this.projectRepository.save(project);

    this.eventEmitter.emit('project.completed', {
      projectId: updatedProject.id,
      title: updatedProject.title,
      userId: userId,
      timestamp: updatedProject.completedAt,
    });

    return updatedProject;
  }

  async removeProject(userId: string, projectId: string): Promise<{ message: string }> {
    const project = await this.findOne(projectId);

    if (project.user.id !== userId) {
      throw new UnauthorizedException('You can only delete your own projects');
    }
    await this.projectRepository.remove(project);
    
    return { message: 'Project and associated milestones deleted successfully' };
  }

  async addMilestone(userId: string, projectId: string, addMilestoneDto: AddMilestoneDto): Promise<Milestone> {
    const project = await this.findOne(projectId);

    if (project.user.id !== userId) {
      throw new UnauthorizedException('You can only update your own projects');
    }

    const milestone = this.milestoneRepository.create({
      description: addMilestoneDto.description,
      project: { id: projectId },
    });
    const savedMilestone = await this.milestoneRepository.save(milestone);

    this.eventEmitter.emit('project.milestone.added', {
      projectId: projectId,
      userId: userId, 
      milestoneId: savedMilestone.id,
      description: savedMilestone.description,
      timestamp: new Date(),
    });

    return savedMilestone;
  }

  async updateMilestone(
    userId: string,
    projectId: string,
    milestoneId: string,
    updateMilestoneDto: UpdateMilestoneDto,
  ): Promise<Milestone> {
    const project = await this.findOne(projectId);
    
    if (project.user.id !== userId) {
      throw new UnauthorizedException('You can only update milestones for your own projects');
    }

    const milestone = await this.milestoneRepository.findOne({
      where: { 
        id: milestoneId,
        project: { id: projectId } 
      },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    milestone.description = updateMilestoneDto.description;
    return this.milestoneRepository.save(milestone);
  }

  async removeMilestone(userId: string, projectId: string, milestoneId: string): Promise<{ message: string }> {
    const project = await this.findOne(projectId);
    
    if (project.user.id !== userId) {
      throw new UnauthorizedException('You can only delete milestones for your own projects');
    }

    const milestone = await this.milestoneRepository.findOne({
      where: { 
        id: milestoneId,
        project: { id: projectId } 
      },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    await this.milestoneRepository.remove(milestone);
    
    return { message: 'Milestone deleted successfully' };
  }

  
  async addComment(userId: string, milestoneId: string, content: string): Promise<Comment> {
    const milestone = await this.milestoneRepository.findOne({ 
      where: { id: milestoneId },
      relations: ['project', 'project.user'] 
    });
    if (!milestone) throw new NotFoundException('Milestone not found');

    const comment = this.commentRepository.create({
      content,
      author: { id: userId },
      milestone: { id: milestoneId },
    });
    const savedComment = await this.commentRepository.save(comment);

    this.eventEmitter.emit('feed.comment.added', {
      milestoneId,
      projectId: milestone.project.id,
      userId: milestone.project.user.id, 
      comment: content,
      authorId: userId,
    });

    return savedComment;
  }

  async requestCollaboration(senderId: string, projectId: string): Promise<CollaborationRequest> {
    const project = await this.projectRepository.findOne({ 
      where: { id: projectId },
      relations: ['user'] // The owner
    });
    if (!project) throw new NotFoundException('Project not found');

    if (project.user.id === senderId) {
      throw new BadRequestException('You cannot collaborate on your own project');
    }

    const request = this.collabRepository.create({
      sender: { id: senderId },
      receiver: { id: project.user.id },
      project: { id: projectId },
    });
    const savedRequest = await this.collabRepository.save(request);

    const senderProfile = await this.userRepository.findOne({ where: { id: senderId } });
    if (!senderProfile) throw new NotFoundException('Sender not found');

    
    await this.mailService.sendDirectMessageNotification(
      project.user.email, 
      `Collaboration Request from ${senderProfile.username} for ${project.title}`
    );

    return savedRequest;
  }
}