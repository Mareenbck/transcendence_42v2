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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
const prisma_service_1 = require("../../prisma/prisma.service");
const auth_service_1 = require("../auth.service");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../../user/user.service");
const common_2 = require("@nestjs/common");
let TwoFactorAuthService = class TwoFactorAuthService {
    constructor(authservice, configService, userService, prisma) {
        this.authservice = authservice;
        this.configService = configService;
        this.userService = userService;
        this.prisma = prisma;
    }
    async generate2FAsecret(email) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpauthUrl = otplib_1.authenticator.keyuri(email, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);
        await this.userService.set2FASecretToUser(secret, email);
        return {
            secret,
            otpauthUrl,
        };
    }
    async generate2FAQRCode(otpauthUrl) {
        return (0, qrcode_1.toDataURL)(otpauthUrl);
    }
    isTwoFactorAuthenticationCodeValid(twoFAcode, user) {
        if (!twoFAcode || !user.twoFAsecret) {
            throw new common_2.BadRequestException('Missing authentication code or user secret');
        }
        try {
            const isValid = otplib_1.authenticator.verify({
                token: twoFAcode,
                secret: user.twoFAsecret
            });
            return isValid;
        }
        catch (error) {
            return false;
        }
    }
    async turn_on(user) {
        await this.userService.turnOn2FA(user.email);
        const tokens = await this.authservice.generateTokens(user.id, user.email, true);
        return tokens;
    }
    async loginWith2fa(dto) {
        const user = await this.userService.getByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid User');
        }
        const tokens = await this.authservice.generateTokens(dto.id, dto.email, true);
        await this.authservice.updateRefreshToken(dto.id, tokens.refresh_token);
        return tokens;
    }
    async getIs2FA(dto) {
        const user = await this.userService.getByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid User');
        }
        return user.twoFA;
    }
};
TwoFactorAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService,
        user_service_1.UserService,
        prisma_service_1.PrismaService])
], TwoFactorAuthService);
exports.TwoFactorAuthService = TwoFactorAuthService;
//# sourceMappingURL=2FactorAuth.service.js.map