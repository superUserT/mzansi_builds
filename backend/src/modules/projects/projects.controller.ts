import { Controller, Get, Post, Body, Delete, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AddMilestoneDto } from './dto/add-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(req.user.userId, createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/milestones')
  addMilestone(
    @Request() req: any,
    @Param('id') id: string,
    @Body() addMilestoneDto: AddMilestoneDto,
  ) {
    return this.projectsService.addMilestone(req.user.userId, id, addMilestoneDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/complete')
  markAsCompleted(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.markAsCompleted(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/milestones/:milestoneId')
  updateMilestone(
    @Request() req: any,
    @Param('id') projectId: string,
    @Param('milestoneId') milestoneId: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    return this.projectsService.updateMilestone(
      req.user.userId,
      projectId,
      milestoneId,
      updateMilestoneDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeProject(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.removeProject(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/milestones/:milestoneId')
  removeMilestone(
    @Request() req: any,
    @Param('id') projectId: string,
    @Param('milestoneId') milestoneId: string,
  ) {
    return this.projectsService.removeMilestone(req.user.userId, projectId, milestoneId);
  }
}