import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    constructor(config: ConfigService, userService: UserService);
    validate(payload: any): Promise<{
        userId: any;
        email: any;
    }>;
}
export {};
