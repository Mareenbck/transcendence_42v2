import { CreateChatroomDto } from './dto/create-chatroom2.dto';
import { ChatroomService } from './chatroom2.service';
import { UserService } from 'src/user/user.service';
export declare class Chatroom2Controller {
    private chatRoomService;
    private readonly userService;
    constructor(chatRoomService: ChatroomService, userService: UserService);
    create(newConv: any, userId: string): Promise<number>;
    createUserTable({ userId, channelId, hash }: {
        userId: number;
        channelId: number;
        hash?: string;
    }): Promise<false | import(".prisma/client").UserOnChannel>;
    delete(channelId: string): Promise<import(".prisma/client").Chatroom>;
    findAll(): Promise<CreateChatroomDto[]>;
    getUserTable(id: string, channelId: string): Promise<import(".prisma/client").UserOnChannel[]>;
    getParticipants(channelId: string): Promise<(import(".prisma/client").UserOnChannel & {
        user: import(".prisma/client").User;
    })[]>;
    addAdmin(channelId: string, userId: string): Promise<number>;
    openFriendship(ids: any, userId: string): Promise<any>;
    getReceived(userId: string): Promise<(import(".prisma/client").ChatroomInvitations & {
        chatroom: import(".prisma/client").Chatroom;
    })[]>;
    updateDemand(invitation: any): Promise<import(".prisma/client").ChatroomInvitations>;
    leaveChannel(chatroomId: number, userId: string): Promise<import(".prisma/client").Chatroom>;
    changePassword(channelId: string, hash: any): Promise<import(".prisma/client").Chatroom>;
    kick(channelId: string, userId: string): Promise<import(".prisma/client").UserOnChannel>;
    ban(channelId: string, userId: string): Promise<import(".prisma/client").UserOnChannel>;
    unBan(channelId: string, userId: string): Promise<import(".prisma/client").UserOnChannel>;
    mute(channelId: string, userId: string): Promise<(import(".prisma/client").UserOnChannel & {
        user: import(".prisma/client").User;
    })[]>;
    unmute(channelId: string, userId: string): Promise<(import(".prisma/client").UserOnChannel & {
        user: import(".prisma/client").User;
    })[]>;
}
