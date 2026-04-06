import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity('milestones')
export class Milestone {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  description!: string;

  @CreateDateColumn()
  achievedAt!: Date;

  @ManyToOne(() => Project, (project) => project.milestones, { onDelete: 'CASCADE' })
  project!: Project;
}