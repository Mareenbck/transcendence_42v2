"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const user_service_1 = require("../user/user.service");
const game_service_1 = require("../game/game.service");
const game_controller_1 = require("../game/game.controller");
const global_service_1 = require("./global.service");
const chat_service_1 = require("../chat/chat.service");
const chatroom2_service_1 = require("../chat/chatroom2/chatroom2.service");
let GlobalModule = class GlobalModule {
};
GlobalModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [],
        controllers: [game_controller_1.GameController],
        providers: [global_service_1.GlobalService, chatroom2_service_1.ChatroomService, chat_service_1.ChatService, prisma_service_1.PrismaService, game_service_1.GameService, user_service_1.UserService],
        exports: [global_service_1.GlobalService],
    })
], GlobalModule);
exports.GlobalModule = GlobalModule;
//# sourceMappingURL=global.module.js.map