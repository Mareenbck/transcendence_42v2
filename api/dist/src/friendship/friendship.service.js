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
var FriendshipService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendshipService = void 0;
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const path = require("path");
let FriendshipService = FriendshipService_1 = class FriendshipService {
    constructor(prisma, userService) {
        this.prisma = prisma;
        this.userService = userService;
        this.server = null;
        this.logger = new common_1.Logger(FriendshipService_1.name);
    }
    async openFriendship(requesterId, receiverId) {
        const friendship = await this.prisma.friendship.create({
            data: {
                requesterId: requesterId,
                receiverId: receiverId,
            },
        });
        return friendship;
    }
    async getReceivedFriendships(userId) {
        const { id } = userId;
        try {
            const user = await this.userService.getUser(parseInt(id));
            const demands = await this.prisma.friendship.findMany({
                where: {
                    receiverId: user.id,
                },
                include: {
                    requester: true,
                },
            });
            return demands;
        }
        catch (error) {
            throw new common_1.BadRequestException('getReceivedFriendships error : ' + error);
        }
    }
    async updateFriendship(id) {
        const { demandId, response } = id;
        const friendhip = await this.prisma.friendship.update({
            where: {
                id: parseInt(demandId),
            },
            data: {
                status: response,
            },
        });
        return friendhip;
    }
    async addFriend(request) {
        const { requesterId, receiverId } = request;
        const requester = await this.userService.getUser(parseInt(requesterId));
        const receiver = await this.userService.getUser(parseInt(receiverId));
        await this.userService.addFriendOnTable(requester.id, receiver.id);
        await this.userService.addFriendOnTable(receiver.id, requester.id);
        await this.userService.updateAchievement(requester.id, 'Famous');
        await this.userService.updateAchievement(receiver.id, 'Famous');
    }
    async showFriends(id) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: parseInt(id) },
                include: { friends: true, friendOf: true }
            });
            return user;
        }
        catch (error) {
            console.error(error);
        }
    }
    async findFriendship(userOne, userTwo) {
        const friendships = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    { requesterId: userOne, receiverId: userTwo },
                    { requesterId: userTwo, receiverId: userOne },
                ],
            },
        });
        const friendship = friendships[0];
        return friendship;
    }
    async findFriendshipById(demandId) {
        const friendship = await this.prisma.friendship.findUniqueOrThrow({
            where: {
                id: demandId,
            },
        });
        return friendship;
    }
    async findAndDeleteFriendship(userOne, userTwo) {
        const friendship = await this.findFriendship(userOne, userTwo);
        if (!friendship) {
            throw new common_1.BadRequestException('findAndDeleteFriendship error : ');
        }
        await this.prisma.friendship.delete({
            where: { id: friendship.id },
        });
    }
    async deleteRefusedFriendship() {
        await this.prisma.friendship.deleteMany({
            where: { status: 'REFUSED' },
        });
    }
    async removeFriend(usersId) {
        const { friendId, currentId } = usersId;
        const updatedCurrent = await this.userService.removeFriendOnTable(parseInt(currentId), friendId);
        await this.findAndDeleteFriendship(friendId, parseInt(currentId));
        return updatedCurrent;
    }
    async getUserAvatar(userId, res) {
        try {
            const user = await this.userService.getUser(userId);
            if (user.avatar) {
                const fileName = path.basename(user.avatar);
                const result = res.sendFile(fileName, { root: process.env.UPLOAD_DIR });
                return result;
            }
            else if (!user.ftAvatar && !user.avatar) {
                const fileName = process.env.DEFAULT_AVATAR;
                const result = res.sendFile(fileName, { root: process.env.PATH_DEFAULT_AVATAR });
                return result;
            }
            else if (user.ftAvatar && !user.avatar) {
                return res.status(204).send();
            }
        }
        catch (_a) {
            throw new common_1.ForbiddenException('Not Found');
        }
    }
};
FriendshipService = FriendshipService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_service_1.UserService])
], FriendshipService);
exports.FriendshipService = FriendshipService;
//# sourceMappingURL=friendship.service.js.map