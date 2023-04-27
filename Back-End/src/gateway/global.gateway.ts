import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection,
  SubscribeMessage, OnGatewayInit,
  WebSocketGateway, OnGatewayDisconnect,
  WebSocketServer, WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GlobalService } from './global.service';
import { ChatService } from '../chat/chat.service';
import { GameService } from '../game/game.service';
import { FriendshipService } from '../friendship/friendship.service';
import { Logger } from "@nestjs/common";
import UsersSockets from "./socket.class";
import { AuthService } from 'src/auth/auth.service';
import { UserService } from "src/user/user.service";
import { UserDto } from 'src/user/dto/user.dto';
import { CreateChatMessDto } from 'src/chat/chat-mess/dto/create-chatMess.dto';

@WebSocketGateway(
8001, { cors: {origin: "http://localhost:8080",}, }
/*{
  cors: ["*"],
  origin: ["*"],
  path: "",
}*/
)

export class GlobalGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GlobalGateway.name);
  private userSockets: UsersSockets;
  constructor(
      private readonly gameService: GameService,
      private readonly chatService: ChatService,
      private readonly globalService: GlobalService,
      private readonly authService: AuthService,
	  private readonly friendshipService: FriendshipService,
  ) {
      this.userSockets = new UsersSockets();
  }

  @WebSocketServer()
  server: Server;

  afterInit() {
      this.globalService.server = this.server;
      this.gameService.server = this.server;
      this.chatService.server = this.server;
      this.globalService.userSockets = this.userSockets;
      this.chatService.userSockets = this.userSockets;
      this.gameService.userSockets = this.userSockets;
      this.logger.verbose("globalGateway Initialized");
  }

  async handleConnection(socket: Socket) {
    try {
// console.log("Enter Global Soket server");
// console.log(socket.handshake.auth.token);
      const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
      if (!user) {
        throw new WsException('Invalid credentials.');
      }
      socket.data.username = user.username as string;
      socket.data.email = user.email as string;
      this.userSockets.addUser(socket);
    } catch (e) {
        this.userSockets.removeSocket(socket)
        socket.disconnect(true);
    }
console.log("68 handleConnect: client");
  }

  async handleDisconnect(client: Socket) {
  // console.log("71 handleDisconnect: client");
    this.userSockets.removeSocket(client)
    client.disconnect(true);
  }


  ///////////////////////////
  // Messages for Chat to Chat Service
  //////////////////////////
  @SubscribeMessage('addUserChat')
  async chatAddUsers(@MessageBody() userId: any, @ConnectedSocket() socket: Socket,): Promise<void>
  {
    if (userId.userId !== null) {
      const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
      if (!user) {
        throw new WsException('Invalid credentials.');
      }
      this.chatService.addUserChat(userId, socket.id)
    }
  }

  @SubscribeMessage('removeUserChat')
  async chatRemoveUsers(@MessageBody() userId: string, @ConnectedSocket() socket: Socket,)
  { this.chatService.removeUserChat(userId) }

  @SubscribeMessage('userRoom')
  async chatUserRoom(@MessageBody() data: {roomId: number, userId: number}, @ConnectedSocket() socket: Socket,): Promise<void>
  { this.chatService.addRoomUser(data.roomId, data.userId, socket.id);  }

  @SubscribeMessage('sendMessageRoom')
  async chatSendChatM(@MessageBody()  data: {authorId: number, chatroomId: number, content: string,}, @ConnectedSocket() socket: Socket,)
  { this.chatService.sendRoomMessage(data.authorId, data.chatroomId, data.content,) }

  @SubscribeMessage('sendMessageDirect')
  async chatSendDirectM(@MessageBody() data: {content: string, author: string, receiver: string}, @ConnectedSocket() socket: Socket,): Promise<void>
  { this.chatService.sendDirectMessage(data.content, data.author, data.receiver,)  }

  @SubscribeMessage('sendConv')
  async chatSendConversation(@MessageBody() data: {channelId: number, name: string, isPublic: boolean, isPrivate: boolean, isProtected: boolean}, @ConnectedSocket() socket: Socket,): Promise<void>
  { this.chatService.sendConv(data.channelId, data.name, data.isPublic, data.isPrivate, data.isProtected) };

  @SubscribeMessage('toBlock')
  async chatBlock(@MessageBody() data: {blockFrom: number, blockTo: number}, @ConnectedSocket() socket: Socket,): Promise<void>
  { this.chatService.chatBlock(data.blockFrom, data.blockTo,) };

  @SubscribeMessage('toUnblock')
  async chatUnblock(@MessageBody() data: {blockFrom: number, blockTo: number}, @ConnectedSocket() socket: Socket,): Promise<void>
  { this.chatService.chatUnblock(data.blockFrom, data.blockTo,)  };

  @SubscribeMessage('InviteGame')
  async chatInvite(@MessageBody() data: {author: UserDto, player: UserDto}, @ConnectedSocket() socket: Socket,): Promise<void>
  { this.chatService.chatInvite(data.author, data.player,) };



///////////////////////////
// Messages for Game: Invite et random
//////////////////////////
  @SubscribeMessage('acceptGame')
  async acceptGame(@MessageBody() data: {author: UserDto, player: UserDto}, @ConnectedSocket() socket: Socket,): Promise<void>
  { this.gameService.acceptGame(data.author, data.player) };

  @SubscribeMessage('refuseGame')
  async refuseGame(@MessageBody() data: {author: UserDto, player: UserDto}, @ConnectedSocket() socket: Socket,): Promise<void>
  { this.gameService.refuseGame(data.author, data.player) };

  @SubscribeMessage('InviteGame')
  async gameInvite(@MessageBody() data: {author: UserDto, player: UserDto}, @ConnectedSocket() socket: Socket,): Promise<void>
  {
    this.gameService.gameInvite(data.author, data.player) };

  @SubscribeMessage('playGame')
  async playGame(@MessageBody() data: {user: any, roomN: number}, @ConnectedSocket() socket: Socket,): Promise<void>
  {
    this.gameService.playGame(data.user, data.roomN);
  };

  @SubscribeMessage('listRooms')
  async listRooms(@ConnectedSocket() socket: Socket): Promise<void>
  {
    this.gameService.sendListRooms();
  };

//   @SubscribeMessage('doIplay')
//   async doIplay(@ConnectedSocket() socket: Socket): Promise<void>
//   {
// console.log("157_doIplay: socket.id = ", socket.id);
//     let user = this.userSockets.getUserBySocket(socket.id);
//     if(user) this.gameService.checkPlayerInRooms(user);
//   };

	@SubscribeMessage('updateDemands')
	async updateDemands(@MessageBody() updatedDemands: any[]): Promise<void> {
		const updatedDemand = await this.friendshipService.updateFriendship(updatedDemands);
		this.server.emit('demandsUpdated', updatedDemand);
	}

	@SubscribeMessage('updateFriends')
	async updateFriends(@MessageBody() updatedFriends: any[]): Promise<void> {
		this.server.emit('friendsUpdated', updatedFriends);
	}

	@SubscribeMessage('createDemand')
	async createDemand(@MessageBody() receiverId: any ): Promise<void> {
		// Récupérer les demandes mises à jour
		const pendingDemands = await this.friendshipService.getReceivedFriendships(receiverId);
		// Envoyer les demandes mises à jour à tous les clients connectés
		this.server.emit('pendingDemands', pendingDemands);
	}

}
