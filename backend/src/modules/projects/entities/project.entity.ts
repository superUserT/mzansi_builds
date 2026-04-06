import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Milestone } from './milestone.entity';

export enum ProjectStage {
  IDEATION = 'Ideation',
  PROTOTYPING = 'Prototyping',
  MVP = 'MVP',
  SCALING = 'Scaling',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column({
    type: 'enum',
    enum: ProjectStage,
    default: ProjectStage.IDEATION,
  })
  stage!: ProjectStage;

  @Column('simple-array', { nullable: true })
  supportRequired?: string[];

  @Column({ nullable: true })
  githubLink?: string;

  @Column({ nullable: true })
  liveLink?: string;

  @Column({ default: false })
  isCompleted!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  coverImageUrl?: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true, onDelete: 'CASCADE' })
  user!: User;

  @OneToMany(() => Milestone, (milestone) => milestone.project, { cascade: true, eager: true })
  milestones!: Milestone[];
}