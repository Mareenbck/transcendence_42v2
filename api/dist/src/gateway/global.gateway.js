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
var GlobalGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const global_service_1 = require("./global.service");
const chat_service_1 = require("../chat/chat.service");
const game_service_1 = require("../game/game.service");
const friendship_service_1 = require("../friendship/friendship.service");
const common_1 = require("@nestjs/common");
const socket_class_1 = require("./socket.class");
const auth_service_1 = require("../auth/auth.service");
const user_service_1 = require("../user/user.service");
const chatroom2_service_1 = require("../chat/chatroom2/chatroom2.service");
let GlobalGateway = GlobalGateway_1 = class GlobalGateway {
    constructor(chatroomService, gameService, chatService, globalService, authService, userService, friendshipService) {
        this.chatroomService = chatroomService;
        this.gameService = gameService;
        this.chatService = chatService;
        this.globalService = globalService;
        this.authService = authService;
        this.userService = userService;
        this.friendshipService = friendshipService;
        this.logger = new common_1.Logger(GlobalGateway_1.name);
        this.userSockets = new socket_class_1.default();
    }
    afterInit() {
        this.globalService.server = this.server;
        this.userService.server = this.server;
        this.chatroomService.server = this.server;
        this.gameService.server = this.server;
        this.chatService.server = this.server;
        this.friendshipService.server = this.server;
        this.globalService.userSockets = this.userSockets;
        this.chatService.userSockets = this.userSockets;
        this.gameService.userSockets = this.userSockets;
        this.chatroomService.userSockets = this.userSockets;
        this.friendshipService.userSockets = this.userSockets;
        this.userService.userSockets = this.userSockets;
        this.logger.verbose("globalGateway Initialized");
    }
    async handleConnection(socket) {
        try {
            const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
            if (!user) {
                throw new websockets_1.WsException('Invalid credentials.');
            }
            socket.data.username = user.username;
            socket.data.email = user.email;
            socket.data.id = user.id;
            this.userSockets.addUser(socket);
        }
        catch (e) {
            this.userSockets.removeSocket(socket);
            socket.disconnect(true);
        }
    }
    async handleDisconnect(client) {
        this.userSockets.removeSocket(client);
        client.disconnect(true);
    }
    async chatAddUsers(userId, socket) {
        if (userId.userId !== null) {
            const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
            if (!user) {
                throw new websockets_1.WsException('Invalid credentials.');
            }
            this.chatService.addUserChat(userId, socket.id);
        }
    }
    async chatRemoveUsers(userId, socket) { this.chatService.removeUserChat(userId); }
    async chatUserRoom(data, socket) {
        if (data.userId !== null) {
            const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
            if (!user) {
                throw new websockets_1.WsException('Invalid credentials.');
            }
            this.chatService.addRoomUser(data.roomId, data.userId, socket.id);
        }
    }
    async chatSendChatM(message2, socket) {
        if (message2.authorId !== null) {
            const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
            if (!user) {
                throw new websockets_1.WsException('Invalid credentials.');
            }
            this.chatService.sendRoomMessage(message2.id, message2.authorId, message2.chatroomId, message2.content, message2.createdAt);
        }
    }
    async chatSendDirectM(data, socket) {
        if (data.author !== null) {
            const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
            if (!user) {
                throw new websockets_1.WsException('Invalid credentials.');
            }
            this.chatService.sendDirectMessage(data.content, data.author, data.receiver);
        }
    }
    async chatSendConversation(data, socket) { this.chatService.sendConv(data.channelId, data.name, data.isPublic, data.isPrivate, data.isProtected); }
    ;
    async chatBlock(data, socket) { this.chatService.chatBlock(data.blockFrom, data.blockTo); }
    ;
    async chatUnblock(data, socket) { this.chatService.chatUnblock(data.blockFrom, data.blockTo); }
    ;
    async chatInvite(data, socket) { this.chatService.chatInvite(data.author, data.player); }
    ;
    async joinChannel(data, socket) { this.chatService.chatJoinedChannel(data.channelId, socket.id); }
    ;
    async leaveChannel(data, socket) { this.chatService.chatLeavedChannel(data.id, socket.id); }
    ;
    async inviteToPriv(data, socket) { this.chatService.invitedToPriv(data.chatroomId, data.receiverId, socket.id); }
    ;
    async acceptedToPriv(data, socket) { this.chatService.acceptedToPriv(data.id, socket.id); }
    ;
    async appLogin(data, socket) {
        if (data.userId !== null) {
            const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
            if (!user) {
                throw new websockets_1.WsException('Invalid credentials.');
            }
            this.chatService.logout();
        }
        ;
    }
    async enterGame(socket) { this.gameService.enterGame(socket.data.id, socket); }
    ;
    async exitGame(data, socket) { this.gameService.exitGame(socket.data.id, data.status, socket); }
    ;
    async acceptGame(data, socket) { this.gameService.acceptGame(data.author, data.player); }
    ;
    async refusalGame(data, socket) { this.gameService.refusalGame(data.author, data.player); }
    ;
    async gameInvite(data, socket) { this.gameService.gameInvite(data.author, data.player); }
    ;
    async playGame(data, socket) {
        socket.rooms.forEach(room => socket.leave(room));
        this.gameService.playGame(socket.data.id, data.roomN);
    }
    ;
    async listRooms(socket) { this.gameService.sendListRooms(); }
    ;
    async updateDemands(data) {
        if (data.status === 'ACCEPTED') {
            const updatedDemand = await this.friendshipService.updateFriendship({ demandId: data.id, response: data.status });
            this.server.emit('demandsUpdated', updatedDemand);
        }
        else if (data.status === 'REFUSED') {
            await this.friendshipService.deleteRefusedFriendship();
        }
    }
    async removeFriend(friendId, socket) {
        const updatedFriendsCurrent = await this.friendshipService.showFriends(friendId);
        const newFriendListCurrent = updatedFriendsCurrent.friendOf;
        this.userSockets.emitToId(updatedFriendsCurrent.id, 'removeFriend', newFriendListCurrent);
    }
    async createDemand(receiverId) {
        const pendingDemands = await this.friendshipService.getReceivedFriendships({ id: receiverId });
        this.server.emit('pendingDemands', pendingDemands);
    }
    async removeConv(data) {
        this.server.emit('deleteChannel', data);
    }
    async showUsersList(data) {
        const showList = await this.userService.getUsers();
        this.server.emit('showUsersList', showList);
    }
    async hidePaperPlane(data) {
        const hidePaperPlane = await this.chatroomService.getParticipants(parseInt(data));
        this.server.emit('toMute', hidePaperPlane);
    }
    async appLogout(data) {
        const user = await this.authService.signout({ userId: data });
        const allUsers = await this.userService.getUsersWithBlocked();
        this.server.emit('users_status', allUsers);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GlobalGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('addUserChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "chatAddUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeUserChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "chatRemoveUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('userRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "chatUserRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessageRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "chatSendChatM", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessageDirect'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "chatSendDirectM", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendConv'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "chatSendConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('toBlock'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "chatBlock", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('toUnblock'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "chatUnblock", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('InviteGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "chatInvite", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinedChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "joinChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "leaveChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('inviteToPriv'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "inviteToPriv", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('acceptedChannelInvite'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "acceptedToPriv", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('login'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "appLogin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('enterGame'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "enterGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('exitGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "exitGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('acceptGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "acceptGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('refuseGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "refusalGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('InviteGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "gameInvite", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "playGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('listRooms'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "listRooms", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateDemands'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "updateDemands", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeFriend'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "removeFriend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createDemand'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "createDemand", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeConv'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "removeConv", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('showUsersList'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "showUsersList", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('toMute'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "hidePaperPlane", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('logout'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GlobalGateway.prototype, "appLogout", null);
GlobalGateway = GlobalGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: ["*"], origin: ["*"], path: "", }),
    __metadata("design:paramtypes", [chatroom2_service_1.ChatroomService,
        game_service_1.GameService,
        chat_service_1.ChatService,
        global_service_1.GlobalService,
        auth_service_1.AuthService,
        user_service_1.UserService,
        friendship_service_1.FriendshipService])
], GlobalGateway);
exports.GlobalGateway = GlobalGateway;
//# sourceMappingURL=global.gateway.js.map