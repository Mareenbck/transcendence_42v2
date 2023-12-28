import { GameService } from './game.service';
import { GameDto } from './dto/game.dto';
import { UserService } from 'src/user/user.service';
export declare class GameController {
    private gameService;
    private readonly userService;
    constructor(gameService: GameService, userService: UserService);
    getGames(): Promise<GameDto[]>;
    create({ playerOneId, playerTwoId, winnerId, score1, score2 }: {
        playerOneId: any;
        playerTwoId: any;
        winnerId: any;
        score1: any;
        score2: any;
    }): Promise<GameDto>;
    getAllUserGames(userId: string): Promise<import(".prisma/client").Game[]>;
    getUserLevel(userId: string): Promise<import(".prisma/client").User>;
    getUserRank(id: string): Promise<{
        rank: number;
    }>;
}
