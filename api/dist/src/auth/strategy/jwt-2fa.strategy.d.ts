import { Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
declare const Jwt2faStrategy_base: new (...args: any[]) => Strategy;
export declare class Jwt2faStrategy extends Jwt2faStrategy_base {
    private prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(data: {
        sub: number;
        email: string;
        is2FA: boolean;
    }): Promise<import(".prisma/client").User>;
}
export {};
