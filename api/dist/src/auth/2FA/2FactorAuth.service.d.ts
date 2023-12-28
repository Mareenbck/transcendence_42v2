import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth.service';
import { ConfigService } from "@nestjs/config";
import { UserService } from 'src/user/user.service';
import { TwoFactorDto, TwoFaUserDto } from 'src/auth/dto/2fa.dto';
export declare class TwoFactorAuthService {
    private authservice;
    private readonly configService;
    private readonly userService;
    private prisma;
    constructor(authservice: AuthService, configService: ConfigService, userService: UserService, prisma: PrismaService);
    generate2FAsecret(email: string): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    generate2FAQRCode(otpauthUrl: string): Promise<any>;
    isTwoFactorAuthenticationCodeValid(twoFAcode: string, user: TwoFactorDto): boolean;
    turn_on(user: TwoFaUserDto): Promise<import("../dto").AuthTokenDto>;
    loginWith2fa(dto: TwoFactorDto): Promise<import("../dto").AuthTokenDto>;
    getIs2FA(dto: TwoFactorDto): Promise<boolean>;
}
