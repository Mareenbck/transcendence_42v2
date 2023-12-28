"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert_users = void 0;
const seed_1 = require("./seed");
const argon = require("argon2");
async function insert_users() {
    console.log('Creation user');
    const users = [
        {
            email: 'e@a.com',
            username: 'Emma',
            avatar: '../upload/avatar-Wbleu.jpg',
            hash: 'secret',
        },
        {
            email: 'l@a.com',
            username: 'Lucie',
            avatar: '../upload/avatar-Wred.jpg',
            hash: 'secret',
        },
        {
            email: 'f@a.com',
            username: 'Fabien',
            avatar: '',
            hash: 'secret',
        },
        {
            email: 'm@a.com',
            username: 'Math',
            avatar: '../upload/avatar-Morange.png',
            hash: 'secret',
        },
    ];
    console.log('Hashing passwords...');
    for (let i = 0; i < users.length; i++) {
        const hashedPassword = await argon.hash(users[i].hash);
        users[i].hash = hashedPassword;
    }
    console.log('Creating users...');
    for (let i = 0; i < users.length; i++) {
        const user = await seed_1.prisma.user.create({
            data: users[i],
        });
        console.log(`User ${user.username} create at id: ${user.id} `);
    }
}
exports.insert_users = insert_users;
//# sourceMappingURL=users.js.map