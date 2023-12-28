import { DirMessDto } from './../../chat/dir-mess/dir-mess.dto';
import { FriendsDto } from 'src/friendship/dto/friends.dto';
import { GameDto } from 'src/game/dto/game.dto';
export declare class UserDto {
    id: number;
    username: string;
    email: string;
    hash: string;
    hashedRtoken: string;
    avatar: string;
    ftAvatar: string;
    is2FA: boolean;
    receivedFriendships: FriendsDto[];
    blockedTo: UserDto[];
    blockedFrom: UserDto[];
    dirMessEmited: DirMessDto[];
    xp: number;
    level: number;
    winner: GameDto[];
}
