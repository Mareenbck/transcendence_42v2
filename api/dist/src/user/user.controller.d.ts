import { UserService } from './user.service';
import { Response } from 'express';
export declare const storage: {
    storage: any;
};
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<import(".prisma/client").User[]>;
    getAllUsersWithBlocked(): Promise<(import(".prisma/client").User & {
        blockedTo: import(".prisma/client").User[];
        blockedFrom: import(".prisma/client").User[];
    })[]>;
    getMeWB(id: number): Promise<import(".prisma/client").User & {
        blockedTo: import(".prisma/client").User[];
        blockedFrom: import(".prisma/client").User[];
    }>;
    getAllUsersWithGames(): Promise<(import(".prisma/client").User & {
        playerOne: import(".prisma/client").Game[];
        playerTwo: import(".prisma/client").Game[];
        winner: import(".prisma/client").Game[];
    })[]>;
    getWithDirectMessages(id: number): Promise<(import(".prisma/client").User & {
        blockedTo: import(".prisma/client").User[];
        blockedFrom: import(".prisma/client").User[];
        dirMessEmited: import(".prisma/client").DirectMessage[];
        dirMessReceived: import(".prisma/client").DirectMessage[];
    })[]>;
    getMe(id: string): Promise<import("./dto/user.dto").UserDto>;
    updateUsername(id: string, username: string): Promise<import(".prisma/client").User>;
    getFriends(userId: string): Promise<import(".prisma/client").User>;
    updateAvatar(id: number, newAvatar: string): Promise<import(".prisma/client").User>;
    uploadFile(file: any, id: number): Promise<import(".prisma/client").User>;
    restore(id: number): Promise<import(".prisma/client").User>;
    block({ blockFrom, blockTo }: {
        blockFrom: any;
        blockTo: any;
    }): Promise<import(".prisma/client").User & {
        blockedTo: import(".prisma/client").User[];
        blockedFrom: import(".prisma/client").User[];
    }>;
    unblock({ blockFrom, unblockTo }: {
        blockFrom: any;
        unblockTo: any;
    }): Promise<import(".prisma/client").User & {
        blockedTo: import(".prisma/client").User[];
        blockedFrom: import(".prisma/client").User[];
    }>;
    getAvatar(id: number, res: Response): Promise<void>;
    getAchievements(userId: string): Promise<(import(".prisma/client").UserAchievement & {
        achievement: import(".prisma/client").Achievement;
    })[]>;
    getIcon(id: string, res: Response): Promise<void>;
}
