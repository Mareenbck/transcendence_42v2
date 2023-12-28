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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("./game.service");
const guard_1 = require("../auth/guard");
const user_service_1 = require("../user/user.service");
let GameController = class GameController {
    constructor(gameService, userService) {
        this.gameService = gameService;
        this.userService = userService;
    }
    async getGames() {
        const allGames = await this.gameService.getGames();
        return allGames;
    }
    async create({ playerOneId, playerTwoId, winnerId, score1, score2 }) {
        const game = await this.gameService.create({
            playerOneId,
            playerTwoId,
            winnerId,
            score1,
            score2
        });
        return game;
    }
    async getAllUserGames(userId) {
        const allGames = await this.gameService.getUserGames(parseInt(userId));
        return allGames;
    }
    async getUserLevel(userId) {
        const allGames = await this.gameService.getUserGames(parseInt(userId));
        const user = await this.gameService.updateUserXPAndLevel(parseInt(userId), allGames);
        return user;
    }
    async getUserRank(id) {
        const rank = await this.gameService.getUserRankByWins(parseInt(id));
        return { rank };
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getGames", null);
__decorate([
    (0, common_1.Post)('/newGame'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/allGames/:id'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getAllUserGames", null);
__decorate([
    (0, common_1.Get)('/level/:id'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getUserLevel", null);
__decorate([
    (0, common_1.Get)('/rank/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getUserRank", null);
GameController = __decorate([
    (0, common_1.Controller)('game'),
    __metadata("design:paramtypes", [game_service_1.GameService,
        user_service_1.UserService])
], GameController);
exports.GameController = GameController;
//# sourceMappingURL=game.controller.js.map