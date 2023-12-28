import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatMessService {
    private prisma;
    constructor(prisma: PrismaService);
    create({ authorId, content, chatroomId, }: {
        authorId: any;
        content: any;
        chatroomId: any;
    }): Promise<any>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").ChatroomMessage[]>;
    findRoom(chatroomId: number): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").ChatroomMessage[]>;
}
