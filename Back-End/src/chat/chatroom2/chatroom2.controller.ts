import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom2.dto';
import { ChatroomService } from './chatroom2.service';

import { JwtGuard} from 'src/auth/guard';
import { GetCurrentUserId } from 'src/decorators/get-userId.decorator';
import { UserService } from 'src/user/user.service';
import { BadRequestException, Injectable, ForbiddenException} from '@nestjs/common';


@Controller('chatroom2/')
export class Chatroom2Controller {
  constructor(private chatRoomService: ChatroomService,
				private readonly userService: UserService) {}

	@Post()
	@UseGuards(JwtGuard)
	async create( @Body() newConv: any, @GetCurrentUserId() userId: string): Promise<number> {
		const newChannel = await this.chatRoomService.create(newConv, parseInt(userId));
		if (newChannel) {
			await this.userService.updateAchievement(parseInt(userId), 'Federator')
		}
		return newChannel.id;
	}

	@Post('join')
	// @UseGuards(JwtGuard)
	async createUserTable(@Body() { userId, channelId, hash }: { userId: number, channelId: number, hash?: string }) {
		const newUserTable = await this.chatRoomService.createUserTable({ userId, channelId }, hash);
		return newUserTable;
	}

  @Get()
  @UseGuards(JwtGuard)
  async findAll(): Promise<CreateChatroomDto[]> {
    return await this.chatRoomService.findAll();
  };

  @Get('userTable/:id/:channelId')
  async getUserTable(@Param('id') id: string, @Param('channelId') channelId:string) {
    const response = await this.chatRoomService.getUserTable(parseInt(id), parseInt(channelId));
    return response;
  };

  @Get(':channelId/participants')
  @UseGuards(JwtGuard)
  async getParticipants(@Param('channelId') channelId: string) {
    const participants = await this.chatRoomService.getParticipants(parseInt(channelId));
    return participants;
  }

@Post(':channelId/admin/:userId')
@UseGuards(JwtGuard)
async addAdmin(@Param('channelId') channelId: string, @Param('userId') userId: string) {
  const response = await this.chatRoomService.addAdmin(parseInt(channelId), parseInt(userId));
  console.log("response in controller", response);
  return response;
}


	@Post('/invite_channel')
	@UseGuards(JwtGuard)
	async openFriendship(@Body() ids: any, @GetCurrentUserId() userId: string) {
		//creation d une demande d'acces dans database
		const { channelId, invitedId } = ids;
		const newDemand = await this.chatRoomService.openInvitations(parseInt(userId), channelId, invitedId);
		return newDemand;
	}

	@Get('/pending_invitations')
	@UseGuards(JwtGuard)
	async getReceived(@GetCurrentUserId() userId: string){
		const demands = await this.chatRoomService.getReceivedInvitations(parseInt(userId));
		return demands;
	}

	@Post('/invit_update')
	@UseGuards(JwtGuard)
	async updateDemand(@Body() invitation: any) {
		const result = await this.chatRoomService.updateInvitation(invitation);
		if (result.status === 'ACCEPTED') {
			await this.chatRoomService.addChatroom(result);
		}
		else if (result.status === 'REJECTED') {
			await this.chatRoomService.deleteRefusedInvitations();
		}
		console.log("result--->")
		console.log(result)
		return result;
	}

	@Post('/:channelId/newpassword')
	@UseGuards(JwtGuard)
	async changePassword(@Param('channelId') channelId: string, @Body() hash:any) {
		const newPassword = await this.chatRoomService.updatePassword(parseInt(channelId), hash);
		return newPassword;
	}

	// @Post('/invite_admin')
	// @UseGuards(JwtGuard)
	// async receiv

}

