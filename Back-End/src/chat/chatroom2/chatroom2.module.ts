import { Module, forwardRef } from '@nestjs/common';
import { Chatroom2Controller } from './chatroom2.controller';
import { ChatroomService } from './chatroom2.service';
import { UserService } from 'src/user/user.service';
// import { forwardRef } from 'react';
// import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaModule } from '../../prisma/prisma.module';


@Module({
  imports: [forwardRef(() => PrismaModule)],
  controllers: [Chatroom2Controller],
  providers: [ChatroomService, UserService],


  //a commenter partie Theo
// import { Module, forwardRef } from '@nestjs/common';
// import { ChatroomController } from './chatroom2.controller';
// import { ChatroomService } from './chatroom2.service';
// import { PrismaModule } from '../../prisma/prisma.module';

// @Module({
//   controllers: [ChatroomController],
//   providers: [ChatroomService]
})
export class ChatroomModule {}
