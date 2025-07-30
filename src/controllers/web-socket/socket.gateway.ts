import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChangedPermissionInterface } from './hidden-action/interfaces/changed-permissions.interface';
import { ChangedRoleInterface } from './hidden-action/interfaces/changed-role.interface';
import { ChangedUserInterface } from './hidden-action/interfaces/changed-user.interface';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket): void {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  //!--> Send a hidden action to update local permissions..................................|
  refreshUser(dto: ChangedUserInterface) {
    this.server.emit('refresh-user', dto);
  }

  //!--> Send a hidden action to update local permissions..................................|
  refreshRole(dto: ChangedRoleInterface) {
    this.server.emit('refresh-role', dto);
  }

  //!--> Send a hidden action to update local permissions..................................|
  refreshPermissions(dto: ChangedPermissionInterface) {
    this.server.emit('refresh-permissions', dto);
  }
}
