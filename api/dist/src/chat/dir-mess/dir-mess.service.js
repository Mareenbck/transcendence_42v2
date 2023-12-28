"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirMessService = void 0;
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
let DirMessService = class DirMessService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create({ content, receiver, author }) {
        return this.prisma.directMessage.create({ data: { content, receiver, author } });
    }
    findAll() {
        return this.prisma.directMessage.findMany();
    }
    findSome(me, friend) {
        return this.prisma.directMessage.findMany({
            where: {
                OR: [
                    { AND: [{ author: +me },
                            { receiver: +friend }]
                    },
                    { AND: [{ author: +friend },
                            { receiver: +me }]
                    },
                ]
            }
        });
    }
    async getLastestMessage(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                dirMessReceived: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    include: { userA: true, userR: true },
                },
                dirMessEmited: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    include: { userA: true, userR: true },
                },
            },
        });
        return user;
    }
    ;
};
DirMessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DirMessService);
exports.DirMessService = DirMessService;
//# sourceMappingURL=dir-mess.service.js.map