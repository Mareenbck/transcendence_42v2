import { DirMessService } from './dir-mess.service';
import { DirMessDto } from './dir-mess.dto';
export declare class DirMessController {
    private dirMessService;
    constructor(dirMessService: DirMessService);
    findAll(): Promise<DirMessDto[]>;
    create({ content, receiver, author }: {
        content: any;
        receiver: any;
        author: any;
    }): Promise<DirMessDto>;
    findDirMess(me: number, friend: number): Promise<import(".prisma/client").DirectMessage[]>;
    UserWithDirectMessages(userId: string): Promise<import(".prisma/client").User & {
        dirMessEmited: (import(".prisma/client").DirectMessage & {
            userR: import(".prisma/client").User;
            userA: import(".prisma/client").User;
        })[];
        dirMessReceived: (import(".prisma/client").DirectMessage & {
            userR: import(".prisma/client").User;
            userA: import(".prisma/client").User;
        })[];
    }>;
}
