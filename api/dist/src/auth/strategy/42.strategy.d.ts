import { AuthService } from '../auth.service';
export interface Profile_42 {
    username: string;
    email: string;
    avatar: string;
    ftAvatar: string;
}
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    getIntraUrl(): Promise<string>;
    validate(accessToken: string, refreshToken: string, profile: Profile_42): Promise<Profile_42>;
}
export {};
