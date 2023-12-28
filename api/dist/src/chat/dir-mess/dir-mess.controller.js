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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirMessController = void 0;
const common_1 = require("@nestjs/common");
const dir_mess_service_1 = require("./dir-mess.service");
const common_2 = require("@nestjs/common");
const guard_1 = require("../../auth/guard");
const get_userId_decorator_1 = require("../../decorators/get-userId.decorator");
let DirMessController = class DirMessController {
    constructor(dirMessService) {
        this.dirMessService = dirMessService;
    }
    async findAll() {
        return this.dirMessService.findAll();
    }
    async create({ content, receiver, author }) {
        const msg = await this.dirMessService.create({ content, receiver, author });
        return msg;
    }
    async findDirMess(me, friend) {
        if (me === undefined || isNaN(me) || friend === undefined || isNaN(me)) {
            throw new common_2.BadRequestException('Undefined user ID');
        }
        return this.dirMessService.findSome(me, friend);
    }
    ;
    async UserWithDirectMessages(userId) {
        const latestmessage = await this.dirMessService.getLastestMessage(parseInt(userId));
        return latestmessage;
    }
    ;
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DirMessController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DirMessController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/:me/:friend'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('me')),
    __param(1, (0, common_1.Param)('friend')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], DirMessController.prototype, "findDirMess", null);
__decorate([
    (0, common_1.Get)('/getMessages'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, get_userId_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DirMessController.prototype, "UserWithDirectMessages", null);
DirMessController = __decorate([
    (0, common_1.Controller)('dir-mess'),
    __metadata("design:paramtypes", [dir_mess_service_1.DirMessService])
], DirMessController);
exports.DirMessController = DirMessController;
//# sourceMappingURL=dir-mess.controller.js.map