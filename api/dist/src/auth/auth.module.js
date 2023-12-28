"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const common_2 = require("@nestjs/common");
const user_module_1 = require("../user/user.module");
const app_module_1 = require("../app.module");
const _2FactorAuth_controller_1 = require("./2FA/2FactorAuth.controller");
const _2FactorAuth_service_1 = require("./2FA/2FactorAuth.service");
const jwt_2fa_strategy_1 = require("./strategy/jwt-2fa.strategy");
const _42_strategy_1 = require("./strategy/42.strategy");
const strategy_1 = require("./strategy");
const passport_1 = require("@nestjs/passport");
const local_strategy_1 = require("./strategy/local.strategy");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '600000s' },
            }),
            (0, common_2.forwardRef)(() => app_module_1.AppModule),
            user_module_1.UserModule,
            passport_1.PassportModule,
        ],
        controllers: [auth_controller_1.AuthController, _2FactorAuth_controller_1.TwoFactorAuthenticationController],
        providers: [
            auth_service_1.AuthService,
            local_strategy_1.LocalStrategy,
            strategy_1.JwtStrategy,
            _2FactorAuth_service_1.TwoFactorAuthService,
            jwt_2fa_strategy_1.Jwt2faStrategy,
            _42_strategy_1.FortyTwoStrategy,
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map