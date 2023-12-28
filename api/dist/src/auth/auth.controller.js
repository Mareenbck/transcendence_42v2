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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const decorator_1 = require("./decorator");
const auth_dto_1 = require("./dto/auth.dto");
const signin_dto_1 = require("./dto/signin.dto");
const _2fa_dto_1 = require("./dto/2fa.dto");
const _42_strategy_1 = require("./strategy/42.strategy");
const local_auth_guard_1 = require("./guard/local-auth.guard");
const guard_1 = require("./guard");
let AuthController = class AuthController {
    constructor(authService, fortyTwoStrategy) {
        this.authService = authService;
        this.fortyTwoStrategy = fortyTwoStrategy;
    }
    signup(dto) {
        return this.authService.signup(dto);
    }
    async signin(dto, response) {
        const tokens = await this.authService.signin(dto);
        await this.authService.updateStatus(tokens);
        return tokens;
    }
    async logout(user) {
        const delogUser = await this.authService.signout(user);
        console.log("delogUser =>", delogUser);
        return delogUser;
    }
    async login42() {
        const url = await this.fortyTwoStrategy.getIntraUrl();
        return { url };
    }
    async callback_42(request, response) {
        const code = request.body.code;
        try {
            const tokens = await this.authService.exchangeCodeForTokens(code);
            if (!tokens.access_token) {
                return;
            }
            const userProfile = await this.authService.getFortyTwoUserProfile(tokens.access_token);
            const user = await this.authService.signin_42(userProfile);
            const newtokens = await this.authService.generateTokens(user.id, user.email, user.twoFA);
            await this.authService.updateRefreshToken(user.id, newtokens.refresh_token);
            await this.authService.updateStatus(newtokens);
            return response.status(common_1.HttpStatus.OK).send({ newtokens, user });
        }
        catch (error) {
            console.log(error);
        }
    }
    async refresh(authTokenDto) {
        try {
            const refreshToken = authTokenDto.refresh_token;
            if (!refreshToken) {
                throw new common_1.BadRequestException('No refresh token provided');
            }
            return await this.authService.refresh_token(refreshToken);
        }
        catch (_a) {
            console.error("refresh ");
            return false;
        }
    }
};
__decorate([
    (0, common_1.Post)('/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/signin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_dto_1.SigninDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('/logout'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.HttpCode)(200),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_2fa_dto_1.TwoFaUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('42'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login42", null);
__decorate([
    (0, common_1.Post)('42/callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "callback_42", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        _42_strategy_1.FortyTwoStrategy])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map