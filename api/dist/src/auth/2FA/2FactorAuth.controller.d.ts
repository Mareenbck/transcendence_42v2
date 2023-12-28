import { TwoFactorAuthService } from './2FactorAuth.service';
import { Response } from 'express';
import { TwoFactorDto } from 'src/auth/dto/2fa.dto';
import { UserService } from 'src/user/user.service';
export declare class TwoFactorAuthenticationController {
    private readonly twoFactorAuthService;
    private userService;
    constructor(twoFactorAuthService: TwoFactorAuthService, userService: UserService);
    get2FA(user: TwoFactorDto): Promise<boolean>;
    register(response: Response, email: string): Promise<Response<any, Record<string, any>>>;
    turnOn(user: TwoFactorDto): Promise<import(".prisma/client").User>;
    turn_off(user: TwoFactorDto): Promise<import(".prisma/client").User>;
    authenticate({ twoFAcode }: any, user: TwoFactorDto): Promise<false | import("../dto").AuthTokenDto>;
}
