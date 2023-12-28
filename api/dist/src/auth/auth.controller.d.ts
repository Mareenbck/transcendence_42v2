import { AuthService } from "./auth.service";
import { AuthDto, AuthTokenDto } from './dto/auth.dto';
import { SigninDto } from './dto/signin.dto';
import { Response } from 'express';
import { TwoFaUserDto } from './dto/2fa.dto';
import { FortyTwoStrategy } from './strategy/42.strategy';
export declare class AuthController {
    private authService;
    private fortyTwoStrategy;
    constructor(authService: AuthService, fortyTwoStrategy: FortyTwoStrategy);
    signup(dto: AuthDto): Promise<AuthTokenDto>;
    signin(dto: SigninDto, response: Response): Promise<AuthTokenDto>;
    logout(user: TwoFaUserDto): Promise<any>;
    login42(): Promise<{
        url: string;
    }>;
    callback_42(request: any, response: Response): Promise<Response<any, Record<string, any>>>;
    refresh(authTokenDto: AuthTokenDto): Promise<false | AuthTokenDto>;
}
