"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_friendship = void 0;
const seed_1 = require("./seed");
async function create_friendship() {
    console.log('Find users');
    const emma = await seed_1.prisma.user.findUnique({ where: { id: 1 } });
    const lucie = await seed_1.prisma.user.findUnique({ where: { id: 2 } });
    console.log('Creating friendship...');
    const friendship = await seed_1.prisma.friendship.create({
        data: {
            status: 'ACCEPTED',
            requester: {
                connect: { id: emma.id },
            },
            receiver: {
                connect: { id: lucie.id },
            },
        },
    });
    await seed_1.prisma.user.update({
        where: { id: emma.id },
        data: {
            friends: { connect: { id: lucie.id } },
            achievements: {
                create: {
                    achievement: { connect: { name: 'Famous' } },
                }
            }
        },
    });
    await seed_1.prisma.user.update({
        where: { id: lucie.id },
        data: {
            friends: { connect: { id: emma.id } },
            achievements: {
                create: {
                    achievement: { connect: { name: 'Famous' } },
                }
            }
        },
    });
    console.log(`Friendship ${friendship.id} created`);
    console.log(`Friendship created between ${emma.username} et ${lucie.username}`);
}
exports.create_friendship = create_friendship;
//# sourceMappingURL=friendships.js.map