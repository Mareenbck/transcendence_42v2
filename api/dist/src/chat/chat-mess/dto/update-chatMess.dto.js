"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChatMessDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_chatMess_dto_1 = require("./create-chatMess.dto");
class UpdateChatMessDto extends (0, mapped_types_1.PartialType)(create_chatMess_dto_1.CreateChatMessDto) {
}
exports.UpdateChatMessDto = UpdateChatMessDto;
//# sourceMappingURL=update-chatMess.dto.js.map