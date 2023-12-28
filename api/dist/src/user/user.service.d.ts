import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDto } from './dto/user.dto';
import { Response } from 'express';
import { Server } from "socket.io";
import UsersSockets from "src/gateway/socket.class";
export declare class UserService {
    private readonly prisma;
    server: Server;
    private readonly logger;
    userSockets: UsersSockets;
    constructor(prisma: PrismaService);
    createUser(email: string, username: string, hash: string, avatar?: string, ftAvatar?: string): Promise<User>;
    getUsers(): Promise<User[]>;
    getUsersWithBlocked(): Promise<(User & {
        blockedTo: User[];
        blockedFrom: User[];
    })[]>;
    getMeWithBlocked(id: number): Promise<User & {
        blockedTo: User[];
        blockedFrom: User[];
    }>;
    getUsersWithGames(): Promise<(User & {
        playerOne: import(".prisma/client").Game[];
        playerTwo: import(".prisma/client").Game[];
        winner: import(".prisma/client").Game[];
    })[]>;
    getUsersWithMessages(id: number): Promise<(User & {
        blockedTo: User[];
        blockedFrom: User[];
        dirMessEmited: import(".prisma/client").DirectMessage[];
        dirMessReceived: import(".prisma/client").DirectMessage[];
    })[]>;
    getUser(id: number): Promise<UserDto>;
    getAchievementById(id: number): Promise<import(".prisma/client").Achievement>;
    getUserFriendList(id: number): Promise<User & {
        friendOf: User[];
    }>;
    getByEmail(email: string): Promise<User | null>;
    set2FASecretToUser(secret: string, email: string): Promise<User>;
    turnOn2FA(email: string): Promise<User>;
    turnOff2FA(email: string): Promise<User>;
    updateUsername(id: string, newUsername: string): Promise<User>;
    updateAvatar(id: number, newAvatar: string): Promise<User>;
    restoreAvatar(id: number): Promise<User>;
    getFriends(id: number): Promise<User>;
    addFriendOnTable(id1: number, id2: number): Promise<User & {
        friends: User[];
        friendOf: User[];
    }>;
    removeFriendOnTable(id1: number, id2: number): Promise<User & {
        friends: User[];
        friendOf: User[];
    }>;
    getUserAchievements(id: number): Promise<(import(".prisma/client").UserAchievement & {
        achievement: import(".prisma/client").Achievement;
    })[]>;
    getIconAchievement(achievementId: number, res: Response): Promise<void>;
    updateAchievement(userId: number, achievementName: string): Promise<any>;
    block(blockFrom: number, blockTo: number): Promise<User & {
        blockedTo: User[];
        blockedFrom: User[];
    }>;
    unblock(blockFrom: number, unblockTo: number): Promise<User & {
        blockedTo: User[];
        blockedFrom: User[];
    }>;
}
