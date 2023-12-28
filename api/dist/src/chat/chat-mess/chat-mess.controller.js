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
exports.ChatMessController = void 0;
const common_1 = require("@nestjs/common");
const chat_mess_service_1 = require("./chat-mess.service");
const common_2 = require("@nestjs/common");
const guard_1 = require("../../auth/guard");
let ChatMessController = class ChatMessController {
    constructor(chatMessService) {
        this.chatMessService = chatMessService;
    }
    async findAll() {
        return this.chatMessService.findAll();
    }
    async createM({ authorId, content, chatroomId, }) {
        const msg = await this.chatMessService.create({ authorId, content, chatroomId, });
        return msg;
    }
    async findRoom(chatroomId) {
        if (chatroomId === undefined || isNaN(chatroomId)) {
            throw new common_2.BadRequestException('Undefined room ID');
        }
        const msg = await this.chatMessService.findRoom(chatroomId);
        return msg;
    }
    ;
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatMessController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatMessController.prototype, "createM", null);
__decorate([
    (0, common_1.Get)('/room/:chatroomId'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('chatroomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatMessController.prototype, "findRoom", null);
ChatMessController = __decorate([
    (0, common_1.Controller)('chat-mess'),
    __metadata("design:paramtypes", [chat_mess_service_1.ChatMessService])
], ChatMessController);
exports.ChatMessController = ChatMessController;
//# sourceMappingURL=chat-mess.controller.js.map