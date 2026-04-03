import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Milestone } from './milestone.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column()
  stage!: string; 

  @Column({ nullable: true })
  supportRequired?: string;

  @Column({ nullable: true })
  githubLink?: string;

  @Column({ nullable: true })
  liveLink?: string;

  @Column({ default: false })
  isCompleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user!: User;

  @OneToMany(() => Milestone, (milestone) => milestone.project, { cascade: true, eager: true })
  milestones!: Milestone[];
}