import { Server } from "socket.io";
import UsersSockets from "./socket.class";
export declare class GlobalService {
    server: Server;
    userSockets: UsersSockets;
    constructor();
    notifyIfConnectedId(userIds: number[], eventName: string, eventData: any): void;
}
