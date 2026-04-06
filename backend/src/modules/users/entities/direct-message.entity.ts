import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('direct_messages')
export class DirectMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  sentAt!: Date;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  sender!: User;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  receiver!: User;
}
