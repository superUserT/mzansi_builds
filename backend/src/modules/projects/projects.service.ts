import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Milestone } from './entities/milestone.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { AddMilestoneDto } from './dto/add-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Milestone)
    private readonly milestoneRepository: Repository<Milestone>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
      milestoneId: savedMilestone.id,
      description: savedMilestone.description,
      timestamp: new Date(),
    });

    return savedMilestone;
  }

  async markAsCompleted(userId: string, projectId: string): Promise<Project> {
    const project = await this.findOne(projectId);

    if (project.user.id !== userId) {
      throw new UnauthorizedException('You can only complete your own projects');
    }

    project.isCompleted = true;
    const updatedProject = await this.projectRepository.save(project);

    this.eventEmitter.emit('project.completed', {
      projectId: updatedProject.id,
      title: updatedProject.title,
      timestamp: new Date(),
    });

    return updatedProject;
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

  async removeProject(userId: string, projectId: string): Promise<{ message: string }> {
    const project = await this.findOne(projectId);

    if (project.user.id !== userId) {
      throw new UnauthorizedException('You can only delete your own projects');
    }
    await this.projectRepository.remove(project);
    
    return { message: 'Project and associated milestones deleted successfully' };
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
}