"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatroomModule = void 0;
const common_1 = require("@nestjs/common");
const chatroom2_controller_1 = require("./chatroom2.controller");
const chatroom2_service_1 = require("./chatroom2.service");
const user_service_1 = require("../../user/user.service");
const prisma_module_1 = require("../../prisma/prisma.module");
let ChatroomModule = class ChatroomModule {
};
ChatroomModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => prisma_module_1.PrismaModule)],
        controllers: [chatroom2_controller_1.Chatroom2Controller],
        providers: [chatroom2_service_1.ChatroomService, user_service_1.UserService],
    })
], ChatroomModule);
exports.ChatroomModule = ChatroomModule;
//# sourceMappingURL=chatroom2.module.js.map