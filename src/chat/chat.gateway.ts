import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket, 
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token?.split(' ')[1];
      if (!token) throw new Error('No token');
      
      const decoded = this.jwtService.verify(token);
      client.data.user = decoded;
      console.log(`Client connected: ${client.id} - User: ${decoded.sub}`);
    } catch (_e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { receiverId: string, conversationId: string, content: string },
    @ConnectedSocket() client: Socket
  ) {
    const senderId = client.data.user.sub;
    
    // Check for blocks
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: senderId, blockedId: data.receiverId },
          { blockerId: data.receiverId, blockedId: senderId }
        ]
      }
    });

    if (block) {
      // Typically we'd emit an error event back to the sender
      client.emit('error', 'Cannot send message to this user.');
      return;
    }

    // Save to DB
    const message = await this.prisma.message.create({
      data: {
        senderId,
        receiverId: data.receiverId,
        conversationId: data.conversationId,
        content: data.content,
      },
    });

    // Broadcast to the conversation room or directly if implemented
    this.server.emit(`newMessage_${data.conversationId}`, message);
    
    return message;
  }
}

