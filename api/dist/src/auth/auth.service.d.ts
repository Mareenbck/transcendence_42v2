import { PrismaService } from "../prisma/prisma.service";
import { AuthDto, AuthTokenDto } from "./dto";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { SigninDto } from "./dto/signin.dto";
import { UserService } from "src/user/user.service";
export interface Profile_42 {
    username: string;
    email: string;
    avatar: string;
    ftAvatar: string;
}
export declare class AuthService {
    private userService;
    private prisma;
    private jwt;
    private config;
    constructor(userService: UserService, prisma: PrismaService, jwt: JwtService, config: ConfigService);
    signup(dto: AuthDto): Promise<AuthTokenDto>;
    validateUser(email: string, pass: string): Promise<any>;
    signin(dto: SigninDto): Promise<AuthTokenDto>;
    updateStatus(tokens: AuthTokenDto): Promise<void>;
    signin_42(profile: Profile_42): Promise<User>;
    create_42_user(profile: Profile_42): Promise<User>;
    signout(user: any): Promise<any>;
    generateTokens(userId: number, email: string, is2FA?: boolean): Promise<AuthTokenDto>;
    refresh_token(refreshToken: string): Promise<AuthTokenDto>;
    updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
    verifyAccessToken(token: string): Promise<User>;
    exchangeCodeForTokens(code: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getFortyTwoUserProfile(accessToken: string): Promise<Profile_42>;
    generate_random_password(): string;
}
