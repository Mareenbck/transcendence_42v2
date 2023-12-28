"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameParams = exports.GameStatus = void 0;
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["NULL"] = 1] = "NULL";
    GameStatus[GameStatus["WAIT"] = 2] = "WAIT";
    GameStatus[GameStatus["GAME"] = 3] = "GAME";
    GameStatus[GameStatus["WATCH"] = 4] = "WATCH";
    GameStatus[GameStatus["CLOSE"] = 5] = "CLOSE";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
exports.GameParams = {
    GAME_WIDTH: 1.0,
    GAME_HEIGHT: 0.5,
    RACKET_HEIGHT: 0.150,
    RACKET_WIDTH: 0.020,
    RACKET_XBOARD: 5,
    BALL_RADIUS: 0.015,
    RACKET_SPEED_Y: 2,
    BALL_DEFAULT_SPEED: 3,
    BALL_DELTA_SPEED: 0.5,
    PERIOD: 50
};
//# sourceMappingURL=game.interfaces.js.map