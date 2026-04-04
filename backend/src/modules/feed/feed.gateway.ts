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


@WebSocketGateway({ cors: { origin: '*' } })
export class FeedGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(FeedGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected to Live Feed: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @OnEvent('project.milestone.added')
  handleMilestoneAddedEvent(payload: any) {
    this.logger.log(`Broadcasting new milestone for project ${payload.projectId}`);
    this.server.emit('feed_update', {
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