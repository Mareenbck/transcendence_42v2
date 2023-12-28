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
exports.UserController = exports.storage = void 0;
const common_1 = require("@nestjs/common");
const guard_1 = require("../auth/guard");
const user_service_1 = require("./user.service");
const get_userId_decorator_1 = require("../decorators/get-userId.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = require("path");
const uuid_1 = require("uuid");
exports.storage = {
    storage: (0, multer_1.diskStorage)({
        destination: process.env.UPLOAD_DIR,
        filename: async (request, file, callback) => {
            const filename = path.parse(file.originalname).name.replace(/\s/g, '') + (0, uuid_1.v4)();
            const extension = path.parse(file.originalname).ext;
            callback(undefined, `${filename}${extension}`);
        },
    })
};
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getAllUsers() {
        const allUsers = await this.userService.getUsers();
        return allUsers;
    }
    async getAllUsersWithBlocked() {
        const allUsers = await this.userService.getUsersWithBlocked();
        return allUsers;
    }
    async getMeWB(id) {
        if (id === undefined || isNaN(id)) {
            throw new common_1.BadRequestException('Undefined user ID in getMeWB of users');
        }
        const me = await this.userService.getMeWithBlocked(+id);
        return me;
    }
    async getAllUsersWithGames() {
        const allUsers = await this.userService.getUsersWithGames();
        return allUsers;
    }
    async getWithDirectMessages(id) {
        if (id === undefined || isNaN(id)) {
            throw new common_1.BadRequestException('Undefined user ID in getWithDirectMessages of users');
        }
        const usersW = await this.userService.getUsersWithMessages(+id);
        return usersW;
    }
    ;
    async getMe(id) {
        const userDto = this.userService.getUser(parseInt(id));
        return userDto;
    }
    async updateUsername(id, username) {
        try {
            const result = await this.userService.updateUsername(id, username);
            return result;
        }
        catch (_a) {
            throw new common_1.ForbiddenException('Username already exists');
        }
    }
    async getFriends(userId) {
        const userDto = await this.userService.getFriends(parseInt(userId));
        return userDto;
    }
    async updateAvatar(id, newAvatar) {
        const result = await this.userService.updateAvatar(id, newAvatar);
        return result;
    }
    async uploadFile(file, id) {
        const updatedUser = await this.userService.updateAvatar(id, file.path);
        return (updatedUser);
    }
    async restore(id) {
        const updatedUser = await this.userService.restoreAvatar(id);
        return (updatedUser);
    }
    async block({ blockFrom, blockTo }) {
        const updatedUser = await this.userService.block(blockFrom, blockTo);
        return (updatedUser);
    }
    async unblock({ blockFrom, unblockTo }) {
        const updatedUser = await this.userService.unblock(blockFrom, unblockTo);
        return (updatedUser);
    }
    async getAvatar(id, res) {
        try {
            const user = await this.userService.getUser(id);
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
        }
        catch (_a) {
            throw new common_1.ForbiddenException('Not Found');
        }
    }
    async getAchievements(userId) {
        const achievements = await this.userService.getUserAchievements(parseInt(userId));
        return achievements;
    }
    async getIcon(id, res) {
        const icon = await this.userService.getIconAchievement(parseInt(id), res);
        return icon;
    }
};
__decorate([
    (0, common_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('block/users'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsersWithBlocked", null);
__decorate([
    (0, common_1.Get)('block/:id'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMeWB", null);
__decorate([
    (0, common_1.Get)('games'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsersWithGames", null);
__decorate([
    (0, common_1.Get)('userWith/:id'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getWithDirectMessages", null);
__decorate([
    (0, common_1.Get)('/profile/:id'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, get_userId_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('/:id/username'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, get_userId_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUsername", null);
__decorate([
    (0, common_1.Get)('/friends/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFriends", null);
__decorate([
    (0, common_1.Post)('/update_avatar'),
    __param(0, (0, get_userId_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)('avatar')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateAvatar", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', exports.storage)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, get_userId_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('restore'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, get_userId_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "restore", null);
__decorate([
    (0, common_1.Post)("block"),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "block", null);
__decorate([
    (0, common_1.Post)("unblock"),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unblock", null);
__decorate([
    (0, common_1.Get)('/:id/avatar'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, get_userId_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAvatar", null);
__decorate([
    (0, common_1.Get)('/:id/achievements'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAchievements", null);
__decorate([
    (0, common_1.Get)('/:id/icon'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getIcon", null);
UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map