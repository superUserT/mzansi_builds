import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Milestone } from './milestone.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  author!: User;

  @ManyToOne(() => Milestone, { onDelete: 'CASCADE' })
  milestone!: Milestone;
}