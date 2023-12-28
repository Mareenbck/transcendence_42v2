import { Socket } from "socket.io";
type SocketMap = Map<string, Socket>;
type SocketMapMap = Map<number, SocketMap>;
export default class UsersSockets {
    private map;
    constructor();
    get users(): SocketMapMap;
    addUser(socket: Socket): void;
    removeSocket(socket: Socket): boolean;
    emitToId(userId: number, event: string, data?: any | undefined): void;
    onFromId(userId: number, event: string, listener?: any | undefined): void;
    offFromId(userId: number, event: string, listener?: any | undefined): void;
    joinToRoomId(userId: number, room: string): void;
    leaveRoom(room: string): void;
    getUserSocketsId(userId: number): SocketMap | undefined;
    getUserIdBySocket(socketId: string): number | undefined;
}
export {};
