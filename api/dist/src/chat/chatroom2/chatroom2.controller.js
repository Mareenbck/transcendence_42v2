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
exports.Chatroom2Controller = void 0;
const common_1 = require("@nestjs/common");
const chatroom2_service_1 = require("./chatroom2.service");
const guard_1 = require("../../auth/guard");
const get_userId_decorator_1 = require("../../decorators/get-userId.decorator");
const user_service_1 = require("../../user/user.service");
let Chatroom2Controller = class Chatroom2Controller {
    constructor(chatRoomService, userService) {
        this.chatRoomService = chatRoomService;
        this.userService = userService;
    }
    async create(newConv, userId) {
        const newChannel = await this.chatRoomService.create(newConv, parseInt(userId));
        if (newChannel) {
            await this.userService.updateAchievement(parseInt(userId), 'Federator');
        }
        return newChannel.id;
    }
    async createUserTable({ userId, channelId, hash }) {
        try {
            const newUserTable = await this.chatRoomService.createUserTable({ userId, channelId }, hash);
            return newUserTable;
        }
        catch (err) {
            console.log('wrong password');
            return false;
        }
    }
    async delete(channelId) {
        const response = await this.chatRoomService.delete(parseInt(channelId));
        return response;
    }
    async findAll() {
        return await this.chatRoomService.findAll();
    }
    ;
    async getUserTable(id, channelId) {
        const response = await this.chatRoomService.getUserTable(parseInt(id), parseInt(channelId));
        return response;
    }
    ;
    async getParticipants(channelId) {
        const participants = await this.chatRoomService.getParticipants(parseInt(channelId));
        return participants;
    }
    async addAdmin(channelId, userId) {
        const response = await this.chatRoomService.addAdmin(parseInt(channelId), parseInt(userId));
        return response;
    }
    async openFriendship(ids, userId) {
        const { channelId, invitedId } = ids;
        const newDemand = await this.chatRoomService.openInvitations(parseInt(userId), channelId, invitedId);
        return newDemand;
    }
    async getReceived(userId) {
        const demands = await this.chatRoomService.getReceivedInvitations(parseInt(userId));
        return demands;
    }
    async updateDemand(invitation) {
        const result = await this.chatRoomService.updateInvitation(invitation);
        if (result.status === 'ACCEPTED') {
            await this.chatRoomService.addChatroom(result);
        }
        else if (result.status === 'REJECTED') {
            await this.chatRoomService.deleteRefusedInvitations();
        }
        return result;
    }
    async leaveChannel(chatroomId, userId) {
        const channel = await this.chatRoomService.removeUserFromChannel(parseInt(userId), chatroomId);
        return channel;
    }
    async changePassword(channelId, hash) {
        const newPassword = await this.chatRoomService.updatePassword(parseInt(channelId), hash);
        return newPassword;
    }
    async kick(channelId, userId) {
        const kickSomeone = await this.chatRoomService.kick(parseInt(channelId), parseInt(userId));
        return kickSomeone;
    }
    async ban(channelId, userId) {
        const banSomeone = await this.chatRoomService.ban(parseInt(channelId), parseInt(userId));
        const allUser = await this.chatRoomService.getParticipants(parseInt(channelId));
        return banSomeone;
    }
    async unBan(channelId, userId) {
        const unBanSomeone = await this.chatRoomService.unBan(parseInt(channelId), parseInt(userId));
        const allUser = await this.chatRoomService.getParticipants(parseInt(channelId));
        return unBanSomeone;
    }
    async mute(channelId, userId) {
        const muted = await this.chatRoomService.mute(parseInt(channelId), parseInt(userId));
        const allUser = await this.chatRoomService.getParticipants(parseInt(channelId));
        return allUser;
    }
    async unmute(channelId, userId) {
        const unmuted = await this.chatRoomService.unmute(parseInt(channelId), parseInt(userId));
        const allUser = await this.chatRoomService.getParticipants(parseInt(channelId));
        return allUser;
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_userId_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "create", null);
__decorate([
    (0, common_1.Post)('join'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "createUserTable", null);
__decorate([
    (0, common_1.Post)('/:channelId/delete'),
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('userTable/:id/:channelId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "getUserTable", null);
__decorate([
    (0, common_1.Get)(':channelId/participants'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "getParticipants", null);
__decorate([
    (0, common_1.Post)(':channelId/admin/:userId'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "addAdmin", null);
__decorate([
    (0, common_1.Post)('/invite_channel'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_userId_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "openFriendship", null);
__decorate([
    (0, common_1.Get)('/pending_invitations'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, get_userId_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "getReceived", null);
__decorate([
    (0, common_1.Post)('/invit_update'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "updateDemand", null);
__decorate([
    (0, common_1.Post)('/leave_channel'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_userId_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "leaveChannel", null);
__decorate([
    (0, common_1.Post)('/:channelId/newpassword'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('/:channelId/kick/:userId'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "kick", null);
__decorate([
    (0, common_1.Post)('/:channelId/ban/:userId'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "ban", null);
__decorate([
    (0, common_1.Post)('/:channelId/unban/:userId'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "unBan", null);
__decorate([
    (0, common_1.Post)('/:channelId/mute/:userId'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "mute", null);
__decorate([
    (0, common_1.Post)('/:channelId/unmute/:userId'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], Chatroom2Controller.prototype, "unmute", null);
Chatroom2Controller = __decorate([
    (0, common_1.Controller)('chatroom2/'),
    __metadata("design:paramtypes", [chatroom2_service_1.ChatroomService,
        user_service_1.UserService])
], Chatroom2Controller);
exports.Chatroom2Controller = Chatroom2Controller;
//# sourceMappingURL=chatroom2.controller.js.map