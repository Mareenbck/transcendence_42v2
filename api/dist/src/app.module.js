"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const prisma_module_1 = require("./prisma/prisma.module");
const chat_module_1 = require("./chat/chat.module");
const global_gateway_1 = require("./gateway/global.gateway");
const global_module_1 = require("./gateway/global.module");
const jwt_1 = require("@nestjs/jwt");
const chat_mess_module_1 = require("./chat/chat-mess/chat-mess.module");
const dir_mess_module_1 = require("./chat/dir-mess/dir-mess.module");
const chatroom2_module_1 = require("./chat/chatroom2/chatroom2.module");
const chat_service_1 = require("./chat/chat.service");
const game_module_1 = require("./game/game.module");
const game_service_1 = require("./game/game.service");
const friendship_module_1 = require("./friendship/friendship.module");
const global_service_1 = require("./gateway/global.service");
const chatroom2_service_1 = require("./chat/chatroom2/chatroom2.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            friendship_module_1.FriendshipModule,
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.register({ secret: `${process.env.JWT_SECRET}` }),
            chatroom2_module_1.ChatroomModule,
            chat_module_1.ChatModule,
            chat_mess_module_1.ChatMessModule,
            dir_mess_module_1.DirMessModule,
            game_module_1.GameModule,
            global_module_1.GlobalModule,
        ],
        providers: [
            global_gateway_1.GlobalGateway,
            global_service_1.GlobalService,
            game_service_1.GameService,
            chat_service_1.ChatService,
            chatroom2_service_1.ChatroomService,
            user_module_1.UserModule,
        ],
        exports: [jwt_1.JwtModule],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map