import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Chatroom } from '@prisma/client';
import { UserOnChannel } from '@prisma/client';
import { Server } from "socket.io";
import { UserService } from 'src/user/user.service';
import UsersSockets from "src/gateway/socket.class";
export declare class ChatroomService {
    private prisma;
    private userService;
    server: Server;
    private readonly logger;
    userSockets: UsersSockets;
    constructor(prisma: PrismaService, userService: UserService);
    create(newConv: any, userId: number): Promise<Chatroom>;
    findAll(): Prisma.PrismaPromise<(Chatroom & {
        participants: UserOnChannel[];
    })[]>;
    findOne(id: number): Promise<Chatroom>;
    getUserTable(userId: number, channelId: number): Promise<UserOnChannel[]>;
    createUserTable(ids: any, hash: string): Promise<UserOnChannel>;
    validatePassword(id: number, hash: string): Promise<boolean>;
    getParticipants(channelId: number): Promise<(UserOnChannel & {
        user: import(".prisma/client").User;
    })[]>;
    addAdmin(channelId: number, userId: number): Promise<number>;
    openInvitations(senderId: number, channelId: number, receiverId: number): Promise<any>;
    getReceivedInvitations(userId: number): Promise<(import(".prisma/client").ChatroomInvitations & {
        chatroom: Chatroom;
    })[]>;
    updateInvitation(invitation: any): Promise<import(".prisma/client").ChatroomInvitations>;
    addChatroom(request: any): Promise<UserOnChannel>;
    deleteRefusedInvitations(): Promise<void>;
    removeUserFromChannel(userId: number, chatroom: any): Promise<Chatroom>;
    deleteInvitationsForLeftRooms(channelId: any, invitedId: any): Promise<void>;
    updatePassword(channelId: number, newPasswordHash: any): Promise<Chatroom>;
    ban(channelId: number, userId: number): Promise<UserOnChannel>;
    unBan(channelId: number, userId: number): Promise<UserOnChannel>;
    mute(channelId: number, userId: number): Promise<UserOnChannel>;
    unmute(channelId: number, userId: number): Promise<UserOnChannel>;
    delete(id: number): Promise<Chatroom>;
    kick(channelId: number, userId: number): Promise<UserOnChannel>;
}
