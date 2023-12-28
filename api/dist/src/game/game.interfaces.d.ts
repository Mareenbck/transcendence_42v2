export declare enum GameStatus {
    NULL = 1,
    WAIT = 2,
    GAME = 3,
    WATCH = 4,
    CLOSE = 5
}
import { UserDto } from "src/user/dto/user.dto";
export interface player {
    user: UserDto;
    racket: racket;
    score: number;
}
export interface ball {
    x: number;
    y: number;
}
export interface racket {
    x: number;
    y: number;
}
export interface GameInit {
    table_width: number;
    table_height: number;
    ballR: number;
    ballSpeed: number;
    racketWidth: number;
    racketHeight: number;
    scoreR: number;
    scoreL: number;
}
export interface roomsList {
    roomN: number;
    playerR: UserDto;
    playerL: UserDto;
    scoreR: number;
    scoreL: number;
}
export interface invited {
    author: UserDto;
    player: UserDto;
}
export interface winners {
    winner: UserDto;
    playerR: UserDto;
    playerL: UserDto;
}
export declare const GameParams: {
    GAME_WIDTH: number;
    GAME_HEIGHT: number;
    RACKET_HEIGHT: number;
    RACKET_WIDTH: number;
    RACKET_XBOARD: number;
    BALL_RADIUS: number;
    RACKET_SPEED_Y: number;
    BALL_DEFAULT_SPEED: number;
    BALL_DELTA_SPEED: number;
    PERIOD: number;
};
