"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const game_interfaces_1 = require("./game.interfaces");
const game_class_1 = require("./game.class");
let GameService = class GameService {
    constructor(prisma, userService) {
        this.prisma = prisma;
        this.userService = userService;
        this.server = null;
        this.players = [];
        this.invited = [];
        this.gameMap = [];
        this.roomArray = [];
        this.roomN = 0;
        this.changeScore = (roomN, scoreR, scoreL) => {
            const index = this.roomArray.findIndex(i => i.roomN == roomN);
            if (index !== -1) {
                this.roomArray[index].scoreR = scoreR;
                this.roomArray[index].scoreL = scoreL;
                this.sendListRooms();
            }
        };
        this.searchPair = (author, player) => {
            const index = this.invited.findIndex(i => i.author.id == author && i.player.id == player);
            if (index !== -1) {
                this.invited.splice(index, 1);
                return true;
            }
            return false;
        };
        this.enterGame = async (userId, socket) => {
            if (isNaN(userId))
                return;
            if (this.players.length == 1 && this.players.some(id => id == userId)) {
                socket.emit('status', game_interfaces_1.GameStatus.WAIT);
            }
            else {
                const playerDto = await this.userService.getUser(userId);
                const index = this.gameMap.findIndex(game => game.checkPlayer(playerDto));
                if (index != -1) {
                    const game = this.gameMap[index];
                    game.init(playerDto);
                    game.initMoveEvents();
                    socket.join(`room${game.roomN}`);
                    socket.emit('status', game_interfaces_1.GameStatus.GAME);
                    this.sendListRooms();
                }
            }
        };
        this.exitGame = async (userId, status, socket) => {
            if (status == game_interfaces_1.GameStatus.WAIT) {
                if (this.players.some(id => +id == +userId)) {
                    this.players = [];
                }
                const index = this.invited.findIndex(p => p.author.id == userId);
                if (index != -1) {
                    this.invited = this.invited.filter(p => p.author.id != userId);
                }
                socket.emit('status', game_interfaces_1.GameStatus.NULL);
            }
            else if (status == game_interfaces_1.GameStatus.GAME) {
                const playerDto = await this.userService.getUser(userId);
                const index = this.gameMap.findIndex(game => game.checkPlayer(playerDto));
                if (index != -1) {
                    const game = this.gameMap[index];
                    game.exitGame(playerDto);
                }
                socket.emit('status', game_interfaces_1.GameStatus.NULL);
            }
        };
        this.addPlayer = (userId) => {
            !this.players.some(id => +id === +userId) &&
                this.players.push(userId);
        };
        this.addNewRoom = (playerR, playerL) => {
            var _a, _b;
            const room = `room${this.roomN}`;
            (_a = this.userSockets.getUserSocketsId(playerR.id)) === null || _a === void 0 ? void 0 : _a.forEach(socket => socket.leave(room));
            (_b = this.userSockets.getUserSocketsId(playerL.id)) === null || _b === void 0 ? void 0 : _b.forEach(socket => socket.leave(room));
            this.userSockets.joinToRoomId(playerR.id, room);
            this.userSockets.joinToRoomId(playerL.id, room);
            let game = new game_class_1.GameRoom(this.server, this.roomN, this, this.userSockets);
            if (game) {
                game.init(playerR);
                game.init(playerL);
                game.setPlayers(playerR, playerL);
                game.initMoveEvents();
                this.gameMap.push(game);
                this.roomArray.push({ roomN: this.roomN, playerR: playerR, playerL: playerL, scoreR: 0, scoreL: 0 });
                this.players = [];
                this.sendListRooms();
                game.run();
                this.roomN++;
            }
        };
        this.removeRoom = (roomN) => {
            const filteredGameMap = this.gameMap.filter(i => i.roomN !== roomN);
            this.gameMap = filteredGameMap;
            this.roomArray = this.roomArray.filter(i => i.roomN != roomN);
            this.sendListRooms();
        };
        this.sendListRooms = () => {
            this.server.emit("gameRooms", this.roomArray);
        };
        this.playGame = async (userId, roomN) => {
            if (roomN == -1) {
                this.addPlayer(userId);
                this.userSockets.emitToId(userId, 'status', game_interfaces_1.GameStatus.WAIT);
                if (this.players.length == 2) {
                    const playerR = await this.userService.getUser(this.players[0]);
                    const playerL = await this.userService.getUser(this.players[1]);
                    this.userSockets.emitToId(playerR.id, 'status', game_interfaces_1.GameStatus.GAME);
                    this.userSockets.emitToId(playerL.id, 'status', game_interfaces_1.GameStatus.GAME);
                    this.addNewRoom(playerR, playerL);
                }
            }
            else {
                let game = this.gameMap.find(i => i.roomN == roomN);
                const playerDto = await this.userService.getUser(userId);
                game.init(playerDto);
                game.initMoveEvents();
                this.userSockets.joinToRoomId(playerDto.id, `room${roomN}`);
                this.userSockets.emitToId(playerDto.id, 'status', game_interfaces_1.GameStatus.WATCH);
            }
        };
        this.gameInvite = (author, player) => {
            this.userSockets.emitToId(author.id, 'status', game_interfaces_1.GameStatus.WAIT);
            this.invited.push({ author, player });
        };
        this.acceptGame = async (authorId, playerId) => {
            if (this.searchPair(authorId, playerId)) {
                this.userSockets.emitToId(authorId, 'status', game_interfaces_1.GameStatus.GAME);
                this.userSockets.emitToId(playerId, 'status', game_interfaces_1.GameStatus.GAME);
                const playerR = await this.userService.getUser(authorId);
                const playerL = await this.userService.getUser(playerId);
                this.userSockets.emitToId(playerId, 'winner', { winner: null });
                this.addNewRoom(playerR, playerL);
            }
        };
        this.refusalGame = (authorId, playerId) => {
            if (this.searchPair(authorId, playerId)) {
                this.userSockets.emitToId(authorId, 'status', game_interfaces_1.GameStatus.CLOSE);
                this.userSockets.emitToId(playerId, 'status', game_interfaces_1.GameStatus.NULL);
            }
            ;
        };
    }
    async create({ playerOneId, playerTwoId, winnerId, score1, score2 }) {
        await this.userService.updateAchievement(parseInt(playerOneId), 'Rookie');
        await this.userService.updateAchievement(parseInt(playerTwoId), 'Rookie');
        await this.userService.updateAchievement(parseInt(winnerId), 'Winner');
        return this.prisma.game.create({ data: { playerOneId, playerTwoId, winnerId, score1, score2 } });
    }
    async getGames() {
        return await this.prisma.game.findMany({ include: { playerOne: true, playerTwo: true, winner: true } });
    }
    async getUserGames(userId) {
        const games = await this.prisma.game.findMany({
            where: {
                OR: [
                    { playerOneId: userId },
                    { playerTwoId: userId },
                    { winnerId: userId }
                ]
            },
            include: {
                playerOne: true,
                playerTwo: true,
                winner: true
            }
        });
        return games;
    }
    async updateUserXPAndLevel(userId, allGames) {
        const xpPerWin = 25;
        const numWins = allGames.filter(game => game.winnerId === userId).length;
        const newXP = numWins * xpPerWin;
        let newLevel = Math.floor(newXP / 100);
        if (newLevel < 1) {
            newLevel = 1;
        }
        const moduloXp = newXP % 100;
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                xp: moduloXp,
                level: newLevel,
            },
        });
        return user;
    }
    async updateStatusGame(userId) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { status: 'PLAYING' },
        });
    }
    async updateStatusGameOver(userId) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { status: 'ONLINE' },
        });
    }
    async getUserRankByWins(userId) {
        const result = await this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                xp: true,
                level: true,
                winner: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const user = result.find((u) => u.id === userId);
        const userWins = (user === null || user === void 0 ? void 0 : user.winner.length) || 0;
        const higherRankUsers = result.filter((u) => (u.winner.length || 0) > userWins);
        return higherRankUsers.length + 1;
    }
};
GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_service_1.UserService])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map