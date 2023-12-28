import { PrismaService } from '../../prisma/prisma.service';
import { DirectMessage } from '@prisma/client';
export declare class DirMessService {
    private prisma;
    constructor(prisma: PrismaService);
    create({ content, receiver, author }: {
        content: any;
        receiver: any;
        author: any;
    }): import(".prisma/client").Prisma.Prisma__DirectMessageClient<DirectMessage, never>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<DirectMessage[]>;
    findSome(me: number, friend: number): import(".prisma/client").Prisma.PrismaPromise<DirectMessage[]>;
    getLastestMessage(userId: number): Promise<import(".prisma/client").User & {
        dirMessEmited: (DirectMessage & {
            userR: import(".prisma/client").User;
            userA: import(".prisma/client").User;
        })[];
        dirMessReceived: (DirectMessage & {
            userR: import(".prisma/client").User;
            userA: import(".prisma/client").User;
        })[];
    }>;
}
