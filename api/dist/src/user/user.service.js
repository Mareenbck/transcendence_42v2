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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const user_dto_1 = require("./dto/user.dto");
const class_transformer_1 = require("class-transformer");
const path = require("path");
let UserService = UserService_1 = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
        this.server = null;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async createUser(email, username, hash, avatar = '', ftAvatar = '') {
        const user = await this.prisma.user.create({
            data: {
                email,
                username,
                hash,
                avatar,
                ftAvatar,
            },
        });
        return user;
    }
    async getUsers() {
        try {
            const allUsers = await this.prisma.user.findMany({});
            return allUsers;
        }
        catch (error) {
            throw new common_1.BadRequestException('getUser error : ' + error);
        }
    }
    async getUsersWithBlocked() {
        const allUsers = await this.prisma.user.findMany({
            include: { blockedFrom: true, blockedTo: true }
        });
        return allUsers;
    }
    async getMeWithBlocked(id) {
        const me = await this.prisma.user.findUniqueOrThrow({
            include: { blockedFrom: true, blockedTo: true },
            where: { id: id, },
        });
        return me;
    }
    async getUsersWithGames() {
        try {
            const allUsers = await this.prisma.user.findMany({
                include: { playerOne: true, playerTwo: true, winner: true }
            });
            return allUsers;
        }
        catch (error) {
            throw new common_1.BadRequestException('getUser error : ' + error);
        }
    }
    async getUsersWithMessages(id) {
        try {
            const allUsersWithMessages = await this.prisma.user.findMany({
                include: {
                    dirMessEmited: {
                        where: { receiver: id }
                    },
                    dirMessReceived: {
                        where: { author: id }
                    },
                    blockedFrom: true,
                    blockedTo: true
                },
                where: {
                    OR: [
                        { dirMessEmited: { some: { receiver: id } } },
                        { dirMessReceived: { some: { author: id } } }
                    ]
                }
            });
            return allUsersWithMessages;
        }
        catch (error) {
            throw new common_1.BadRequestException('getUser error : ' + error);
        }
    }
    async getUser(id) {
        if (id === undefined) {
            throw new common_1.BadRequestException('Undefined user ID');
        }
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: {
                    id: id,
                },
            });
            const userDTO = (0, class_transformer_1.plainToClass)(user_dto_1.UserDto, user);
            return userDTO;
        }
        catch (error) {
            throw new common_1.BadRequestException('getUser error : ' + error);
        }
    }
    async getAchievementById(id) {
        if (id === undefined) {
            throw new common_1.BadRequestException('Undefined user ID');
        }
        try {
            const achievement = await this.prisma.achievement.findUniqueOrThrow({
                where: {
                    id: id,
                },
            });
            return achievement;
        }
        catch (error) {
            throw new common_1.BadRequestException('getUser error : ' + error);
        }
    }
    async getUserFriendList(id) {
        if (id === undefined) {
            throw new common_1.BadRequestException('Undefined user ID');
        }
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: id,
                },
                include: {
                    friendOf: true
                }
            });
            return user;
        }
        catch (error) {
            throw new common_1.BadRequestException('getUser error : ' + error);
        }
    }
    async getByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        return user;
    }
    async set2FASecretToUser(secret, email) {
        return this.prisma.user.update({
            where: { email: email },
            data: { twoFAsecret: secret },
        });
    }
    async turnOn2FA(email) {
        return this.prisma.user.update({
            where: { email: email },
            data: { twoFA: true },
        });
    }
    async turnOff2FA(email) {
        return this.prisma.user.update({
            where: { email: email },
            data: { twoFA: false },
        });
    }
    async updateUsername(id, newUsername) {
        const updateUser = await this.prisma.user.update({
            where: {
                id: parseInt(id),
            },
            data: {
                username: newUsername,
            },
        });
        return updateUser;
    }
    async updateAvatar(id, newAvatar) {
        const updateUser = await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                avatar: newAvatar,
            },
        });
        return updateUser;
    }
    async restoreAvatar(id) {
        const updateUser = await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                avatar: '',
            },
        });
        return updateUser;
    }
    async getFriends(id) {
        if (id === undefined) {
            throw new common_1.BadRequestException('Undefined user ID');
        }
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: {
                    id: id,
                },
            });
            return user;
        }
        catch (error) {
            throw new common_1.BadRequestException('getUser error : ' + error);
        }
    }
    async addFriendOnTable(id1, id2) {
        const updateUser = await this.prisma.user.update({
            where: {
                id: id1,
            },
            include: { friends: true, friendOf: true },
            data: {
                friends: { connect: { id: id2 } },
            },
        });
        return updateUser;
    }
    async removeFriendOnTable(id1, id2) {
        const user = await this.prisma.user.findUnique({
            where: { id: id1 },
            include: { friends: true, friendOf: true },
        });
        if (!user) {
            throw new Error(`User with id ${id1} not found`);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: id1 },
            data: {
                friends: {
                    disconnect: { id: id2 },
                },
                friendOf: {
                    disconnect: { id: id2 },
                },
            },
            include: { friends: true, friendOf: true },
        });
        return updatedUser;
    }
    async getUserAchievements(id) {
        if (id === undefined) {
            throw new common_1.BadRequestException('Undefined user ID');
        }
        try {
            const achievements = await this.prisma.userAchievement.findMany({
                where: { userId: id },
                include: { achievement: true },
            });
            return achievements;
        }
        catch (error) {
            throw new common_1.BadRequestException('getUser error : ' + error);
        }
    }
    async getIconAchievement(achievementId, res) {
        try {
            const achievement = await this.getAchievementById(achievementId);
            if (achievement.icon) {
                const fileName = path.basename(achievement.icon);
                const result = res.sendFile(fileName, { root: process.env.PATH_BADGE_ICON });
                return result;
            }
            else {
                const fileName = process.env.DEFAULT_AVATAR;
                const result = res.sendFile(fileName, { root: process.env.PATH_DEFAULT_AVATAR });
                return result;
            }
        }
        catch (_a) {
            throw new common_1.ForbiddenException('Not Found');
        }
    }
    async updateAchievement(userId, achievementName) {
        const achievement = await this.prisma.achievement.findUnique({
            where: { name: achievementName },
        });
        if (!achievement) {
            throw new common_1.NotFoundException('Achievement not found');
        }
        const existingUserAchievement = await this.prisma.userAchievement.findFirst({
            where: {
                userId: userId,
                achievementId: achievement.id,
            },
        });
        if (existingUserAchievement) {
            return null;
        }
        if (!existingUserAchievement) {
            await this.prisma.userAchievement.create({
                data: {
                    user: { connect: { id: userId } },
                    achievement: { connect: { id: achievement.id } },
                },
            });
        }
        else {
            return null;
        }
    }
    async block(blockFrom, blockTo) {
        const updateUser = await this.prisma.user.update({
            where: {
                id: +blockFrom,
            },
            data: {
                blockedTo: {
                    connect: [{ id: +blockTo }],
                },
            },
            include: {
                blockedTo: true,
                blockedFrom: true,
            },
        });
        return updateUser;
    }
    ;
    async unblock(blockFrom, unblockTo) {
        const updateUser = await this.prisma.user.update({
            where: {
                id: +blockFrom,
            },
            data: {
                blockedTo: {
                    disconnect: [{ id: +unblockTo }],
                },
            },
            include: {
                blockedTo: true,
                blockedFrom: true,
            },
        });
        return updateUser;
    }
    ;
};
UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map