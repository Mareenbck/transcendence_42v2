import { CreateChatMessDto } from './dto/create-chatMess.dto';
import { ChatMessService } from './chat-mess.service';
export declare class ChatMessController {
    private chatMessService;
    constructor(chatMessService: ChatMessService);
    findAll(): Promise<CreateChatMessDto[]>;
    createM({ authorId, content, chatroomId, }: {
        authorId: any;
        content: any;
        chatroomId: any;
    }): Promise<CreateChatMessDto>;
    findRoom(chatroomId: number): Promise<import(".prisma/client").ChatroomMessage[]>;
}
