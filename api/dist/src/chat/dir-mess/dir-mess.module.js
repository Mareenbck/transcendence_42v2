"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirMessModule = void 0;
const common_1 = require("@nestjs/common");
const dir_mess_controller_1 = require("./dir-mess.controller");
const dir_mess_service_1 = require("./dir-mess.service");
const prisma_module_1 = require("../../prisma/prisma.module");
let DirMessModule = class DirMessModule {
};
DirMessModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => prisma_module_1.PrismaModule)],
        controllers: [dir_mess_controller_1.DirMessController],
        providers: [dir_mess_service_1.DirMessService]
    })
], DirMessModule);
exports.DirMessModule = DirMessModule;
//# sourceMappingURL=dir-mess.module.js.map