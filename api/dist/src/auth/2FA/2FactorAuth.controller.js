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
exports.TwoFactorAuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const _2FactorAuth_service_1 = require("./2FactorAuth.service");
const get_user_decorator_1 = require("../decorator/get-user.decorator");
const _2fa_dto_1 = require("../dto/2fa.dto");
const guard_1 = require("../guard");
const user_service_1 = require("../../user/user.service");
const auth_guard_1 = require("../guard/auth.guard");
let TwoFactorAuthenticationController = class TwoFactorAuthenticationController {
    constructor(twoFactorAuthService, userService) {
        this.twoFactorAuthService = twoFactorAuthService;
        this.userService = userService;
    }
    async get2FA(user) {
        const is2FA = await this.twoFactorAuthService.getIs2FA(user);
        return is2FA;
    }
    async register(response, email) {
        const { otpauthUrl } = await this.twoFactorAuthService.generate2FAsecret(email);
        const qrcode = await this.twoFactorAuthService.generate2FAQRCode(otpauthUrl);
        return response.json(qrcode);
    }
    async turnOn(user) {
        const userFound = await this.userService.turnOn2FA(user.email);
        return userFound;
    }
    async turn_off(user) {
        const userFound = await this.userService.turnOff2FA(user.email);
        return userFound;
    }
    async authenticate({ twoFAcode }, user) {
        try {
            const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(twoFAcode, user);
            if (isCodeValid) {
                return this.twoFactorAuthService.loginWith2fa(user);
            }
            else {
                return false;
            }
        }
        catch (_a) {
            console.error("Error in isTwoFactorAuthenticationCodeValid: ");
            return false;
        }
    }
};
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_2fa_dto_1.TwoFactorDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "get2FA", null);
__decorate([
    (0, common_1.Post)('/generate'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, get_user_decorator_1.GetUser)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/turn-on'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_2fa_dto_1.TwoFactorDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "turnOn", null);
__decorate([
    (0, common_1.Post)('/turn-off'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_2fa_dto_1.TwoFactorDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "turn_off", null);
__decorate([
    (0, common_1.Post)('/authenticate'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, _2fa_dto_1.TwoFactorDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "authenticate", null);
TwoFactorAuthenticationController = __decorate([
    (0, common_1.Controller)('auth/2fa'),
    __metadata("design:paramtypes", [_2FactorAuth_service_1.TwoFactorAuthService,
        user_service_1.UserService])
], TwoFactorAuthenticationController);
exports.TwoFactorAuthenticationController = TwoFactorAuthenticationController;
//# sourceMappingURL=2FactorAuth.controller.js.map