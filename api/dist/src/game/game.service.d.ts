import { PrismaService } from '../prisma/prisma.service';
import { Game } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { GameDto } from './dto/game.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { Server, Socket } from "socket.io";
import UsersSockets from "src/gateway/socket.class";
export declare class GameService {
    private readonly prisma;
    private readonly userService;
    constructor(prisma: PrismaService, userService: UserService);
    server: Server;
    userSockets: UsersSockets;
    gameService: GameService;
    private players;
    private invited;
    private gameMap;
    private roomArray;
    private roomN;
    changeScore: (roomN: number, scoreR: number, scoreL: number) => void;
    searchPair: (author: number, player: number) => boolean;
    enterGame: (userId: number, socket: Socket) => Promise<void>;
    exitGame: (userId: number, status: number, socket: Socket) => Promise<void>;
    addPlayer: (userId: number) => void;
    addNewRoom: (playerR: UserDto, playerL: UserDto) => void;
    removeRoom: (roomN: number) => void;
    sendListRooms: () => void;
    playGame: (userId: number, roomN: number) => Promise<void>;
    gameInvite: (author: UserDto, player: UserDto) => void;
    acceptGame: (authorId: number, playerId: number) => Promise<void>;
    refusalGame: (authorId: number, playerId: number) => void;
    create({ playerOneId, playerTwoId, winnerId, score1, score2 }: {
        playerOneId: any;
        playerTwoId: any;
        winnerId: any;
        score1: any;
        score2: any;
    }): Promise<Game>;
    getGames(): Promise<(Game & {
        playerOne: import(".prisma/client").User;
        playerTwo: import(".prisma/client").User;
        winner: import(".prisma/client").User;
    })[]>;
    getUserGames(userId: number): Promise<Game[]>;
    updateUserXPAndLevel(userId: number, allGames: GameDto[]): Promise<import(".prisma/client").User>;
    updateStatusGame(userId: number): Promise<void>;
    updateStatusGameOver(userId: number): Promise<void>;
    getUserRankByWins(userId: number): Promise<number>;
}
