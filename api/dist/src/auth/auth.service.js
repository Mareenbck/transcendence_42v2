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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const runtime_1 = require("@prisma/client/runtime");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    constructor(userService, prisma, jwt, config) {
        this.userService = userService;
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async signup(dto) {
        const { email, username, password } = dto;
        const hash = await argon.hash(password);
        try {
            const user = await this.userService.createUser(email, username, hash);
            const tokens = await this.generateTokens(user.id, user.email);
            await this.updateRefreshToken(user.id, tokens.refresh_token);
            return tokens;
        }
        catch (error) {
            if (error instanceof runtime_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }
    async validateUser(email, pass) {
        const user = await this.userService.getByEmail(email);
        if (!user)
            throw new common_1.ForbiddenException('Credentials incorrect');
        const pwMatches = await argon.verify(user.hash, pass);
        if (pwMatches) {
            return user;
        }
        return null;
    }
    async signin(dto) {
        const user = await this.validateUser(dto.email, dto.password);
        if (!user)
            throw new common_1.ForbiddenException('Credentials incorrect');
        const tokens = await this.generateTokens(user.id, user.email, user.twoFA);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }
    async updateStatus(tokens) {
        const user = await this.verifyAccessToken(tokens.access_token);
        if (!user)
            throw new common_1.ForbiddenException('Credentials incorrect');
        await this.prisma.user.update({
            where: { id: user.id },
            data: { status: 'ONLINE' },
        });
        await this.userService.updateAchievement(user.id, 'Welcome');
    }
    async signin_42(profile) {
        let user = await this.userService.getByEmail(profile.email);
        if (!user) {
            return this.create_42_user(profile);
        }
        return user;
    }
    async create_42_user(profile) {
        const { email, username, avatar, ftAvatar } = profile;
        const rdm_string = this.generate_random_password();
        const hash = await argon.hash(rdm_string);
        const user = await this.userService.createUser(email, username, hash, avatar, ftAvatar);
        return user;
    }
    async signout(user) {
        const { userId } = user;
        const delog = await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRtoken: { not: null },
            },
            data: {
                hashedRtoken: null,
                status: 'OFFLINE',
            },
        });
        return userId;
    }
    async generateTokens(userId, email, is2FA = false) {
        const payload = {
            sub: userId,
            email: email,
        };
        const secret = this.config.get('JWT_SECRET');
        const access_token_expiration = this.config.get('ACCESS_TOKEN_EXPIRATION');
        const refresh_token_expiration = this.config.get('REFRESH_TOKEN_EXPIRATION');
        const Atoken = await this.jwt.sign(payload, {
            expiresIn: access_token_expiration,
            secret: secret,
        });
        const Rtoken = await this.jwt.sign(payload, {
            expiresIn: refresh_token_expiration,
            secret: secret,
        });
        return {
            access_token: Atoken,
            refresh_token: Rtoken,
        };
    }
    async refresh_token(refreshToken) {
        const decodedToken = this.jwt.decode(refreshToken, { complete: true });
        if (!decodedToken) {
            throw new common_1.BadRequestException('Invalid token');
        }
        const userId = decodedToken.payload.sub;
        const user = await this.userService.getUser(parseInt(userId));
        if (!user || !user.hashedRtoken) {
            throw new common_1.ForbiddenException('Invalid Credentials');
        }
        const pwMatches = await argon.verify(user.hashedRtoken, refreshToken);
        if (!pwMatches) {
            throw new common_1.ForbiddenException('Invalid Credentials');
        }
        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }
    async updateRefreshToken(userId, refreshToken) {
        const hash = await argon.hash(refreshToken);
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRtoken: hash,
            },
        });
    }
    async verifyAccessToken(token) {
        try {
            const decoded = this.jwt.verify(token);
            if (!decoded) {
                throw new common_1.BadRequestException('Invalid access token');
            }
            return await this.userService.getByEmail(decoded.email);
        }
        catch (e) {
            throw new common_1.BadRequestException('Invalid access token');
        }
    }
    async exchangeCodeForTokens(code) {
        const clientID = process.env.FORTYTWO_CLIENT_ID;
        const clientSecret = process.env.FORTYTWO_CLIENT_SECRET;
        const redirectURI = process.env.FORTYTWO_CALLBACK_URL;
        const tokenEndpoint = 'https://api.intra.42.fr/oauth/token';
        const formData = new FormData();
        formData.append('grant_type', 'authorization_code');
        formData.append('client_id', clientID);
        formData.append('client_secret', clientSecret);
        formData.append('redirect_uri', redirectURI);
        formData.append('code', code);
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            body: formData
        });
        const tokens = await response.json();
        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        };
    }
    async getFortyTwoUserProfile(accessToken) {
        try {
            const headers = { Authorization: `Bearer ${accessToken}` };
            const url = 'https://api.intra.42.fr/v2/me';
            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error('Failed to get user profile');
            }
            const data = await response.json();
            const profile = {
                username: data.login,
                email: data.email,
                avatar: '',
                ftAvatar: data.image.versions.small,
            };
            return profile;
        }
        catch (error) {
            console.log(error);
        }
    }
    generate_random_password() {
        const password = Math.random().toString(36).slice(2, 15) +
            Math.random().toString(36).slice(2, 15);
        return password;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService, prisma_service_1.PrismaService, jwt_1.JwtService, config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map