import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from './project.entity';

export enum CollabStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
}

@Entity('collaboration_requests')
export class CollaborationRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: CollabStatus, default: CollabStatus.PENDING })
  status!: CollabStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  sender!: User;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  receiver!: User; 

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  project!: Project;
}