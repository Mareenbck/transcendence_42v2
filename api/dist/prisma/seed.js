"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const games_1 = require("./games");
const achievements_1 = require("./achievements");
const users_1 = require("./users");
const direct_messages_1 = require("./direct_messages");
const friendships_1 = require("./friendships");
exports.prisma = new client_1.PrismaClient();
async function main() {
    await exports.prisma.$connect();
    console.log(`Start seeding ...`);
    const usrsSize = (await exports.prisma.user.findMany({
        select: {
            id: true,
        },
    })).length;
    const sizeGames = (await exports.prisma.game.findMany({
        select: {
            id: true,
        },
    })).length;
    const sizeAchievements = (await exports.prisma.achievement.findMany({
        select: {
            id: true,
        },
    })).length;
    const sizeDM = (await exports.prisma.directMessage.findMany({
        select: {
            id: true,
        },
    })).length;
    const sizeFriend = (await exports.prisma.friendship.findMany({
        select: {
            id: true,
        },
    })).length;
    if (usrsSize == 0) {
        await (0, users_1.insert_users)();
    }
    if (sizeAchievements == 0) {
        await (0, achievements_1.insert_achievements)();
    }
    if (sizeGames == 0) {
        await (0, games_1.insert_games)();
    }
    if (sizeDM == 0) {
        await (0, direct_messages_1.insert_direct_messages)();
    }
    if (sizeFriend == 0) {
        await (0, friendships_1.create_friendship)();
    }
    console.log(`Seeding finished.`);
}
main()
    .then(async () => {
    await exports.prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await exports.prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map