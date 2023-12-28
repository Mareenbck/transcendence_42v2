import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GlobalService } from './global.service';
import { ChatService } from '../chat/chat.service';
import { GameService } from '../game/game.service';
import { FriendshipService } from '../friendship/friendship.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from "src/user/user.service";
import { UserDto } from 'src/user/dto/user.dto';
import { ChatroomService } from 'src/chat/chatroom2/chatroom2.service';
export declare class GlobalGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatroomService;
    private readonly gameService;
    private readonly chatService;
    private readonly globalService;
    private readonly authService;
    private readonly userService;
    private readonly friendshipService;
    private readonly logger;
    private userSockets;
    constructor(chatroomService: ChatroomService, gameService: GameService, chatService: ChatService, globalService: GlobalService, authService: AuthService, userService: UserService, friendshipService: FriendshipService);
    server: Server;
    afterInit(): void;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    chatAddUsers(userId: any, socket: Socket): Promise<void>;
    chatRemoveUsers(userId: string, socket: Socket): Promise<void>;
    chatUserRoom(data: {
        roomId: number;
        userId: number;
    }, socket: Socket): Promise<void>;
    chatSendChatM(message2: {
        id: number;
        authorId: number;
        chatroomId: number;
        content: string;
        createdAt: any;
    }, socket: Socket): Promise<void>;
    chatSendDirectM(data: {
        content: string;
        author: string;
        receiver: string;
    }, socket: Socket): Promise<void>;
    chatSendConversation(data: any, socket: Socket): Promise<void>;
    chatBlock(data: {
        blockFrom: number;
        blockTo: number;
    }, socket: Socket): Promise<void>;
    chatUnblock(data: {
        blockFrom: number;
        blockTo: number;
    }, socket: Socket): Promise<void>;
    chatInvite(data: {
        author: UserDto;
        player: UserDto;
    }, socket: Socket): Promise<void>;
    joinChannel(data: {
        channelId: any;
    }, socket: Socket): Promise<void>;
    leaveChannel(data: {
        id: number;
    }, socket: Socket): Promise<void>;
    inviteToPriv(data: any, socket: Socket): Promise<void>;
    acceptedToPriv(data: {
        id: number;
    }, socket: Socket): Promise<void>;
    appLogin(data: {
        userId: number;
    }, socket: Socket): Promise<void>;
    enterGame(socket: Socket): Promise<void>;
    exitGame(data: {
        status: number;
    }, socket: Socket): Promise<void>;
    acceptGame(data: {
        author: number;
        player: number;
    }, socket: Socket): Promise<void>;
    refusalGame(data: {
        author: number;
        player: number;
    }, socket: Socket): Promise<void>;
    gameInvite(data: {
        author: UserDto;
        player: UserDto;
    }, socket: Socket): Promise<void>;
    playGame(data: {
        roomN: number;
    }, socket: Socket): Promise<void>;
    listRooms(socket: Socket): Promise<void>;
    updateDemands(data: any): Promise<void>;
    removeFriend(friendId: any, socket: Socket): Promise<void>;
    createDemand(receiverId: any): Promise<void>;
    removeConv(data: {
        channelId: number;
    }): Promise<void>;
    showUsersList(data: any): Promise<void>;
    hidePaperPlane(data: any): Promise<void>;
    appLogout(data: any): Promise<void>;
}
