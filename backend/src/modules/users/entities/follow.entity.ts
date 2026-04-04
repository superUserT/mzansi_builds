import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('follows')
@Unique(['follower', 'following']) 
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  follower!: User; 

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  following!: User; 

  @CreateDateColumn()
  createdAt!: Date;
}