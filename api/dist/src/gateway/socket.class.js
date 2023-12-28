"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsersSockets {
    constructor() {
        this.map = new Map();
    }
    get users() {
        return this.map;
    }
    addUser(socket) {
        socket.data.status = "ONLINE";
        if (!this.map.has(socket.data.id)) {
            this.map.set(socket.data.id, new Map().set(socket.id, socket));
        }
        else {
            this.map.get(socket.data.id).set(socket.id, socket);
        }
    }
    removeSocket(socket) {
        if (this.map.has(socket.data.id)) {
            socket.disconnect(true);
            this.map.get(socket.data.id).delete(socket.id);
            if (this.map.get(socket.data.id).size === 0) {
                this.map.delete(socket.data.id);
                return true;
            }
        }
        return false;
    }
    emitToId(userId, event, data = undefined) {
        var _a;
        (_a = this.getUserSocketsId(userId)) === null || _a === void 0 ? void 0 : _a.forEach((socket) => socket.emit(event, data));
    }
    onFromId(userId, event, listener = undefined) {
        var _a;
        (_a = this.getUserSocketsId(userId)) === null || _a === void 0 ? void 0 : _a.forEach((socket) => socket.on(event, listener));
    }
    offFromId(userId, event, listener = undefined) {
        var _a;
        (_a = this.getUserSocketsId(userId)) === null || _a === void 0 ? void 0 : _a.forEach((socket) => socket.off(event, listener));
    }
    joinToRoomId(userId, room) {
        var _a;
        (_a = this.getUserSocketsId(userId)) === null || _a === void 0 ? void 0 : _a.forEach((socket) => socket.join(room));
    }
    leaveRoom(room) {
        var _a;
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.forEach(socketMap => socketMap.forEach(socket => socket.leave(room)));
    }
    getUserSocketsId(userId) {
        return this.map.get(userId);
    }
    getUserIdBySocket(socketId) {
        for (const [key, socketMap] of this.map.entries()) {
            if (socketMap.has(socketId)) {
                return key;
            }
        }
        return undefined;
    }
}
exports.default = UsersSockets;
//# sourceMappingURL=socket.class.js.map