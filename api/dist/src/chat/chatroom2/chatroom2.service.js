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
var ChatroomService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatroomService = void 0;
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const client_3 = require("@prisma/client");
const common_1 = require("@nestjs/common");
const argon = require("argon2");
const user_service_1 = require("../../user/user.service");
let ChatroomService = ChatroomService_1 = class ChatroomService {
    constructor(prisma, userService) {
        this.prisma = prisma;
        this.userService = userService;
        this.server = null;
        this.logger = new common_1.Logger(ChatroomService_1.name);
    }
    async create(newConv, userId) {
        const { name, isPublic, isPrivate, isProtected, password } = newConv;
        let visibility;
        if (isPrivate) {
            visibility = client_1.UserChannelVisibility.PRIVATE;
        }
        else if (isPublic) {
            visibility = client_1.UserChannelVisibility.PUBLIC;
        }
        else if (isProtected) {
            visibility = client_1.UserChannelVisibility.PWD_PROTECTED;
        }
        let hash = "";
        if (visibility == client_1.UserChannelVisibility.PWD_PROTECTED) {
            hash = await argon.hash(password !== null && password !== void 0 ? password : '');
        }
        const newChannel = await this.prisma.chatroom.create({
            data: {
                name: name,
                visibility: visibility,
                hash: hash,
            },
        });
        const userOnChannel = await this.prisma.userOnChannel.create({
            data: {
                channelId: newChannel.id,
                userId: userId,
                role: "OWNER"
            }
        });
        return newChannel;
    }
    findAll() {
        return this.prisma.chatroom.findMany({
            include: {
                participants: true,
            },
        });
    }
    async findOne(id) {
        const chatRoom = await this.prisma.chatroom.findUnique({ where: { id: id } });
        ;
        return chatRoom;
    }
    async getUserTable(userId, channelId) {
        const users = await this.prisma.userOnChannel.findMany({ where: {
                AND: [
                    { userId: userId },
                    { channelId: channelId },
                ],
            } });
        return users;
    }
    async createUserTable(ids, hash) {
        const { userId, channelId } = ids;
        if (hash) {
            await this.validatePassword(channelId, hash);
        }
        try {
            const newTable = await this.prisma.userOnChannel.create({
                data: {
                    channelId: channelId,
                    userId: userId,
                },
            });
            return newTable;
        }
        catch (err) {
            console.log(err);
        }
    }
    async validatePassword(id, hash) {
        const channel = await this.prisma.chatroom.findUnique({ where: { id: id } });
        if (channel.visibility === client_1.UserChannelVisibility.PWD_PROTECTED) {
            if (!hash) {
                throw new common_1.ForbiddenException(`Password is required`);
            }
            const isPasswordMatch = await argon.verify(channel.hash, hash);
            if (!isPasswordMatch) {
                throw new common_1.ForbiddenException(`Password is required`);
            }
        }
        return true;
    }
    async getParticipants(channelId) {
        if (typeof channelId !== 'number') {
            throw new Error('Invalid value for channelId');
        }
        const channel = await this.prisma.userOnChannel.findMany({
            where: { channelId },
            include: { user: true },
        });
        return channel;
    }
    async addAdmin(channelId, userId) {
        const users = await this.prisma.userOnChannel.findMany({
            where: { channelId },
            include: { user: true },
        });
        if (!users || users.length === 0) {
            throw new common_1.ForbiddenException(`User with ID ${userId} is not on channel with ID ${channelId}`);
        }
        const updatedrole = await this.prisma.userOnChannel.updateMany({
            where: {
                userId, channelId,
            },
            data: {
                role: client_2.UserRoleInChannel.ADMIN,
            },
        });
        return channelId;
    }
    async openInvitations(senderId, channelId, receiverId) {
        let demand;
        demand = await this.prisma.chatroomInvitations.findMany({
            where: {
                chatroomId: channelId,
                receiverId: receiverId,
            },
        });
        if (demand.length === 0) {
            demand = await this.prisma.chatroomInvitations.create({
                data: {
                    senderId: senderId,
                    chatroomId: channelId,
                    receiverId: receiverId,
                },
            });
        }
        return demand;
    }
    async getReceivedInvitations(userId) {
        try {
            const demands = await this.prisma.chatroomInvitations.findMany({
                where: {
                    receiverId: userId,
                },
                include: {
                    chatroom: true,
                },
            });
            return demands;
        }
        catch (error) {
            throw new common_1.BadRequestException('getReceivedInvitations error : ' + error);
        }
    }
    async updateInvitation(invitation) {
        const { invitId, response } = invitation;
        const updated_invitation = await this.prisma.chatroomInvitations.update({
            where: {
                id: parseInt(invitId),
            },
            data: {
                status: response,
            },
        });
        return updated_invitation;
    }
    async addChatroom(request) {
        const { receiverId, chatroomId } = request;
        const newTable = await this.prisma.userOnChannel.create({
            data: {
                channelId: chatroomId,
                userId: receiverId,
            },
        });
        return newTable;
    }
    async deleteRefusedInvitations() {
        await this.prisma.chatroomInvitations.deleteMany({
            where: { status: 'REJECTED' },
        });
    }
    async removeUserFromChannel(userId, chatroom) {
        const { channelId } = chatroom;
        try {
            const result = await this.prisma.userOnChannel.deleteMany({
                where: {
                    AND: [
                        { userId: userId },
                        { channelId: channelId },
                    ]
                },
            });
            const chatRoomX = await this.findOne(channelId);
            if (chatRoomX.visibility === "PRIVATE") {
                this.deleteInvitationsForLeftRooms(channelId, userId);
            }
            return chatRoomX;
        }
        catch (err) {
            console.log(err);
        }
    }
    async deleteInvitationsForLeftRooms(channelId, invitedId) {
        await this.prisma.chatroomInvitations.deleteMany({
            where: {
                AND: [
                    { chatroomId: +channelId },
                    { receiverId: +invitedId },
                ]
            },
        });
    }
    async updatePassword(channelId, newPasswordHash) {
        const { password } = newPasswordHash;
        const newpassword = await argon.hash(password);
        const updatedChatroom = await this.prisma.chatroom.update({
            where: { id: channelId },
            data: { hash: newpassword },
        });
        return updatedChatroom;
    }
    async ban(channelId, userId) {
        try {
            const userOnChannel = await this.prisma.userOnChannel.findFirst({
                where: {
                    channelId: channelId,
                    userId: userId,
                },
            });
            if (!userOnChannel) {
                throw new Error(`User with ID ${userId} is not a member of the channel with ID ${channelId}`);
            }
            const updatedStatus = await this.prisma.userOnChannel.update({
                where: {
                    channelId_userId: {
                        channelId,
                        userId,
                    },
                },
                data: {
                    status: client_3.UserStatusOnChannel.BAN,
                },
            });
            return (updatedStatus);
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to ban user from channel.");
        }
    }
    async unBan(channelId, userId) {
        try {
            const userOnChannel = await this.prisma.userOnChannel.findFirst({
                where: {
                    channelId: channelId,
                    userId: userId,
                },
            });
            if (!userOnChannel) {
                throw new Error(`User with ID ${userId} is not a member of the channel with ID ${channelId}`);
            }
            const updatedStatus = await this.prisma.userOnChannel.update({
                where: {
                    channelId_userId: {
                        channelId,
                        userId,
                    },
                },
                data: {
                    status: client_3.UserStatusOnChannel.CLEAN,
                },
            });
            return (updatedStatus);
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to unban user from channel.");
        }
    }
    async mute(channelId, userId) {
        try {
            const userOnChannel = await this.prisma.userOnChannel.findFirst({
                where: {
                    channelId: channelId,
                    userId: userId,
                },
            });
            if (!userOnChannel) {
                throw new Error(`User with ID ${userId} is not a member of the channel with ID ${channelId}`);
            }
            const updatedStatus = await this.prisma.userOnChannel.update({
                where: {
                    channelId_userId: {
                        channelId,
                        userId,
                    },
                },
                data: {
                    status: client_3.UserStatusOnChannel.MUTE,
                },
            });
            return updatedStatus;
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to mute user from channel.");
        }
    }
    async unmute(channelId, userId) {
        try {
            const userOnChannel = await this.prisma.userOnChannel.findFirst({
                where: {
                    channelId: channelId,
                    userId: userId,
                },
            });
            if (!userOnChannel) {
                throw new Error(`User with ID ${userId} is not a member of the channel with ID ${channelId}`);
            }
            const updatedStatus = await this.prisma.userOnChannel.update({
                where: {
                    channelId_userId: {
                        channelId,
                        userId,
                    },
                },
                data: {
                    status: client_3.UserStatusOnChannel.CLEAN,
                },
            });
            return updatedStatus;
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to unmute user from channel.");
        }
    }
    async delete(id) {
        try {
            const channel = await this.prisma.chatroom.findUnique({
                where: { id },
                include: { participants: true },
            });
            if (!channel) {
                throw new Error('Channel not found');
            }
            await this.prisma.userOnChannel.deleteMany({
                where: { channelId: id },
            });
            await this.prisma.chatroomInvitations.deleteMany({
                where: { chatroomId: id },
            });
            await this.prisma.chatroomMessage.deleteMany({
                where: { chatroomId: id },
            });
            const response = await this.prisma.chatroom.delete({
                where: { id },
            });
            return response;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async kick(channelId, userId) {
        try {
            const userOnChannel = await this.prisma.userOnChannel.findFirst({
                where: {
                    channelId: channelId,
                    userId: userId,
                },
            });
            if (!userOnChannel) {
                throw new Error(`User with ID ${userId} is not a member of the channel with ID ${channelId}`);
            }
            const deletedUserOnChannel = await this.prisma.userOnChannel.delete({
                where: {
                    id: userOnChannel.id,
                },
            });
            return deletedUserOnChannel;
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to kick user from channel.");
        }
    }
};
ChatroomService = ChatroomService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_service_1.UserService])
], ChatroomService);
exports.ChatroomService = ChatroomService;
//# sourceMappingURL=chatroom2.service.js.map