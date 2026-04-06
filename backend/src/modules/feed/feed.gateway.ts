import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  SubscribeMessage
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../users/entities/follow.entity';


@WebSocketGateway({ cors: { origin: '*' } })
export class FeedGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  private readonly logger = new Logger(FeedGateway.name);

  constructor(
    private jwtService: JwtService,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('No token provided');
      
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      const userId = decoded.sub;
      const follows = await this.followRepository.find({
        where: { follower: { id: userId } },
        relations: ['following'],
      });

      follows.forEach((follow) => {
        const roomName = `feed_user_${follow.following.id}`;
        client.join(roomName);
        this.logger.log(`User ${userId} joined room: ${roomName}`);
      });

      this.logger.log(`Client authenticated and connected: ${client.id}`);
    } catch (error) {
      this.logger.warn(`Unauthorized WebSocket connection attempt: ${client.id}`);
      client.disconnect(); 
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @OnEvent('project.milestone.added')
  handleMilestoneAddedEvent(payload: { projectId: string; userId: string; description: string }) {
    const targetRoom = `feed_user_${payload.userId}`;
    this.logger.log(`Broadcasting milestone to room: ${targetRoom}`);
  
    this.server.to(targetRoom).emit('feed_update', {
      type: 'MILESTONE_ADDED',
      data: payload,
    });
  }

  @OnEvent('project.completed')
  handleProjectCompletedEvent(payload: any) {
    this.logger.log(`Broadcasting project completion for project ${payload.projectId}`);
    this.server.emit('feed_update', {
      type: 'PROJECT_COMPLETED',
      data: payload,
    });
  }

  @OnEvent('project.created')
  handleProjectCreatedEvent(payload: any) {
    this.logger.log(`Broadcasting new project ${payload.projectId}`);
    this.server.emit('feed_update', {
      type: 'PROJECT_CREATED',
      data: payload,
    });
  }
}