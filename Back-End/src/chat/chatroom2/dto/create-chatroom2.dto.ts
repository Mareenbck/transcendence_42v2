import { IsNotEmpty, IsString, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateChatroomDto
{
  id:    number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(45)
  name:  string;

  avatar: string;
}

export class CreateRoomDto
{

  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  name:  string;

}
