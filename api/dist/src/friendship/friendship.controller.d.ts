import { FriendshipService } from './friendship.service';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
export declare class FriendshipController {
    private friendshipService;
    private userService;
    constructor(friendshipService: FriendshipService, userService: UserService);
    openFriendship(usersId: any): Promise<import(".prisma/client").Friendship>;
    getReceived(userId: number): Promise<(import(".prisma/client").Friendship & {
        requester: import(".prisma/client").User;
    })[]>;
    showFriends(userId: any): Promise<import(".prisma/client").User[]>;
    updateDemand(demand: any): Promise<import(".prisma/client").Friendship>;
    deleteFriend(usersId: number): Promise<import(".prisma/client").User & {
        friends: import(".prisma/client").User[];
        friendOf: import(".prisma/client").User[];
    }>;
    getAvatar(id: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
