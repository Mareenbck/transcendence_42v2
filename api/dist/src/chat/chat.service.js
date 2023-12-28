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
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const user_service_1 = require("../user/user.service");
let ChatService = ChatService_1 = class ChatService {
    constructor(userService) {
        this.userService = userService;
        this.server = null;
        this.logger = new common_1.Logger(ChatService_1.name);
        this.userChat = new Array();
        this.roomUsers = new Array();
        this.addUserChat = (userId, socketId) => {
            !this.userChat.some((u) => +u.userId.userId === +userId.userId) &&
                this.userChat.push({ userId, socketId });
            this.server.sockets.emit('getUsersChat', this.userChat);
        };
        this.removeUserChat = (userId) => {
            this.userChat = this.userChat.filter(user => +user.userId.userId !== +userId.userId);
            this.roomUsers = this.roomUsers.filter(room => +room.userId.userId !== +userId.userId);
            this.server.sockets.emit('getUsersChat', this.userChat);
        };
        this.addRoomUser = (roomId, userId, socketId) => {
            this.roomUsers = this.roomUsers.filter(room => +room.userId !== +userId);
            roomId && this.roomUsers.push({ roomId, userId, socketId });
        };
        this.getUser = (userId) => {
            return this.userChat.find(u => +u.userId.userId === +userId);
        };
        this.sendRoomMessage = (id, authorId, chatroomId, content, createdAt) => {
            const roomU = this.roomUsers.filter(room => +room.roomId === +chatroomId);
            if (roomU.length > 1) {
                for (const room of roomU) {
                    this.server.to(room.socketId).emit("getMessageRoom", {
                        id, authorId, chatroomId, content, createdAt
                    });
                }
            }
        };
        this.sendDirectMessage = async (content, author, receiver) => {
            const user = this.getUser(receiver);
            const a = this.getUser(author);
            if (user && a) {
                this.server.to(user.socketId).emit("getMessageDirect", {
                    content,
                    author,
                    receiver,
                });
                const usersDirectForReceiver = await this.userService.getUsersWithMessages(receiver);
                if (!usersDirectForReceiver || !(usersDirectForReceiver.find(u => +u.id === +author))) {
                    this.server.to(user.socketId).emit("getNewDirectUser", receiver);
                }
                ;
            }
            if (a && user) {
                const usersDirectForAuthor = await this.userService.getUsersWithMessages(author);
                if (!usersDirectForAuthor || !(usersDirectForAuthor.find(u => +u.id === +author))) {
                    const a = this.getUser(author);
                    this.server.to(a.socketId).emit("getNewDirectUser", author);
                }
                ;
            }
        };
        this.sendConv = (channelId, name, isPublic, isPrivate, isProtected) => {
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
            for (const user of this.userChat) {
                this.server.to(user.socketId).emit('getConv', {
                    channelId: channelId,
                    name: name,
                    visibility: visibility
                });
            }
        };
        this.chatBlock = (blockFrom, blockTo) => {
            const userTo = this.getUser(blockTo);
            const userFrom = this.getUser(blockFrom);
            if (userTo) {
                this.server.to(userTo.socketId).emit('wasBlocked', {
                    id: blockFrom,
                    user: userFrom,
                });
            }
            if (userFrom) {
                this.server.to(userFrom.socketId).emit('blockForMe', {
                    id: blockTo,
                });
            }
        };
        this.chatUnblock = (blockFrom, blockTo) => {
            const userTo = this.getUser(blockTo);
            const userFrom = this.getUser(blockFrom);
            if (userTo) {
                this.server.to(userTo.socketId).emit('wasUnblocked', {
                    id: blockFrom,
                    user: userFrom,
                });
            }
            if (userFrom) {
                this.server.to(userFrom.socketId).emit('unblockForMe', {
                    id: blockTo,
                });
            }
        };
        this.chatInvite = (author, player) => {
            this.userSockets.emitToId(player.id, 'wasInvited', author);
        };
        this.chatJoinedChannel = (channelId, socketId) => {
            this.server.to(socketId).emit('joinedChannelR2', channelId);
        };
        this.chatLeavedChannel = (channelId, socketId) => {
            this.server.to(socketId).emit('leavedChannel', channelId);
        };
        this.invitedToPriv = (channelId, invitedId, socketId) => {
            const userTo = this.getUser(invitedId);
            if (userTo) {
                this.server.to(userTo.socketId).emit('invitedToChannel', channelId);
            }
        };
        this.acceptedToPriv = (channelId, socketId) => {
            this.server.to(socketId).emit('newPriv', channelId);
        };
        this.logout = () => {
            this.server.emit('changeParticipants');
        };
        this.login = () => {
            this.server.emit('changeParticipants');
        };
    }
};
ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_service_1.UserService)),
    __metadata("design:paramtypes", [user_service_1.UserService])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map