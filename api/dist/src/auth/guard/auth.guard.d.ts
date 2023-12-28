import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
export declare class AuthGuard implements CanActivate {
    readonly authService: AuthService;
    constructor(authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
