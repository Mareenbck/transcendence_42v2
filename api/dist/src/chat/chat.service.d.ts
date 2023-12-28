import { Server } from "socket.io";
import UsersSockets from "src/gateway/socket.class";
import { UserService } from "src/user/user.service";
export declare class ChatService {
    private readonly userService;
    server: Server;
    private readonly logger;
    userSockets: UsersSockets;
    constructor(userService: UserService);
    userChat: any[];
    roomUsers: any[];
    addUserChat: any;
    removeUserChat: any;
    addRoomUser: any;
    getUser: any;
    sendRoomMessage: any;
    sendDirectMessage: any;
    sendConv: any;
    chatBlock: any;
    chatUnblock: any;
    chatInvite: any;
    chatJoinedChannel: any;
    chatLeavedChannel: any;
    invitedToPriv: any;
    acceptedToPriv: any;
    logout: any;
    login: any;
}
