import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { Server } from "socket.io";
import UsersSockets from "src/gateway/socket.class";
export declare class FriendshipService {
    private readonly prisma;
    private userService;
    server: Server;
    private readonly logger;
    userSockets: UsersSockets;
    constructor(prisma: PrismaService, userService: UserService);
    openFriendship(requesterId: number, receiverId: number): Promise<import(".prisma/client").Friendship>;
    getReceivedFriendships(userId: any): Promise<(import(".prisma/client").Friendship & {
        requester: import(".prisma/client").User;
    })[]>;
    updateFriendship(id: any): Promise<import(".prisma/client").Friendship>;
    addFriend(request: any): Promise<void>;
    showFriends(id: string): Promise<import(".prisma/client").User & {
        friends: import(".prisma/client").User[];
        friendOf: import(".prisma/client").User[];
    }>;
    findFriendship(userOne: number, userTwo: number): Promise<import(".prisma/client").Friendship>;
    findFriendshipById(demandId: number): Promise<import(".prisma/client").Friendship>;
    findAndDeleteFriendship(userOne: number, userTwo: number): Promise<void>;
    deleteRefusedFriendship(): Promise<void>;
    removeFriend(usersId: any): Promise<import(".prisma/client").User & {
        friends: import(".prisma/client").User[];
        friendOf: import(".prisma/client").User[];
    }>;
    getUserAvatar(userId: number, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
