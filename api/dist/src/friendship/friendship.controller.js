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
exports.FriendshipController = void 0;
const common_1 = require("@nestjs/common");
const friendship_service_1 = require("./friendship.service");
const user_service_1 = require("../user/user.service");
let FriendshipController = class FriendshipController {
    constructor(friendshipService, userService) {
        this.friendshipService = friendshipService;
        this.userService = userService;
    }
    async openFriendship(usersId) {
        const { requesterId, receiverId } = usersId;
        const newFriendship = await this.friendshipService.openFriendship(parseInt(requesterId), receiverId);
        return newFriendship;
    }
    async getReceived(userId) {
        const demands = await this.friendshipService.getReceivedFriendships(userId);
        return demands;
    }
    async showFriends(userId) {
        const { id } = userId;
        const friends = await this.friendshipService.showFriends(id);
        if (friends.friendOf) {
            return friends.friendOf;
        }
        return null;
    }
    async updateDemand(demand) {
        const result = await this.friendshipService.updateFriendship(demand);
        if (result.status === 'ACCEPTED') {
            await this.friendshipService.addFriend(result);
        }
        else if (result.status === 'REFUSED') {
            await this.friendshipService.deleteRefusedFriendship();
        }
        return result;
    }
    async deleteFriend(usersId) {
        const user = this.friendshipService.removeFriend(usersId);
        return user;
    }
    async getAvatar(id, res) {
        const avatar = await this.friendshipService.getUserAvatar(parseInt(id), res);
        return avatar;
    }
};
__decorate([
    (0, common_1.Post)('/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "openFriendship", null);
__decorate([
    (0, common_1.Post)('received'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "getReceived", null);
__decorate([
    (0, common_1.Post)('friends'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "showFriends", null);
__decorate([
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "updateDemand", null);
__decorate([
    (0, common_1.Post)('/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "deleteFriend", null);
__decorate([
    (0, common_1.Get)('/:id/avatar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FriendshipController.prototype, "getAvatar", null);
FriendshipController = __decorate([
    (0, common_1.Controller)('friendship'),
    __metadata("design:paramtypes", [friendship_service_1.FriendshipService,
        user_service_1.UserService])
], FriendshipController);
exports.FriendshipController = FriendshipController;
//# sourceMappingURL=friendship.controller.js.map