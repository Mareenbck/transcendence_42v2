"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
const game_interfaces_1 = require("./game.interfaces");
var ballSpeed = game_interfaces_1.GameParams.BALL_DEFAULT_SPEED;
const ballDeltaSpeed = game_interfaces_1.GameParams.BALL_DELTA_SPEED;
const width = game_interfaces_1.GameParams.GAME_WIDTH;
const height = game_interfaces_1.GameParams.GAME_HEIGHT;
const racket_height = game_interfaces_1.GameParams.RACKET_HEIGHT;
const racket_width = game_interfaces_1.GameParams.RACKET_WIDTH;
const racket_xboard = game_interfaces_1.GameParams.RACKET_XBOARD;
const racketSpeedY = game_interfaces_1.GameParams.RACKET_SPEED_Y;
const ballR = game_interfaces_1.GameParams.BALL_RADIUS;
const MAX_SCORE = 3;
const period = game_interfaces_1.GameParams.PERIOD;
class GameRoom {
    constructor(server, roomN, gameService, userSockets) {
        this.playerL = {
            user: {},
            racket: { x: racket_xboard, y: (height - racket_height) / 2 },
            score: 0,
        };
        this.playerR = {
            user: {},
            racket: { x: width - racket_width - racket_xboard, y: (height - racket_height) / 2 },
            score: 0,
        };
        this.winners = {
            winner: null,
            playerR: {},
            playerL: {},
        };
        this.status = 'null';
        this.ballSpeedX = ballSpeed;
        this.ballSpeedY = ballSpeed;
        this.ball = { x: width / 2, y: height / 2 };
        this.rackets_ypos = [0, 0];
        this.rackets_acel = [0, 0];
        this.isrunning = false;
        this.server = server;
        this.roomN = roomN;
        this.room = `room${roomN}`;
        this.userSockets = userSockets;
        this.gameService = gameService;
        this.playerL.score = 0;
        this.playerR.score = 0;
    }
    emit2all() {
        this.server.to(this.room).emit('pong', {
            ball: this.ball,
            racket1: this.playerR.racket,
            racket2: this.playerL.racket,
            scoreR: this.playerR.score,
            scoreL: this.playerL.score
        });
    }
    init(player) {
        this.userSockets.emitToId(player.id, 'init-pong', {
            table_width: width,
            table_height: height,
            racket_width: racket_width,
            racket_height: racket_height,
            ballR: ballR,
            scoreR: this.playerR.score,
            scoreL: this.playerL.score,
        });
    }
    setPlayers(playerR, playerL) {
        this.playerR.user = playerR;
        this.playerL.user = playerL;
    }
    checkPlayer(player) {
        return +this.playerR.user.id == +player.id || +this.playerL.user.id == +player.id;
    }
    updatePositions() {
        this.rackets_acel[0] = this.playerR.racket.y - this.rackets_ypos[0];
        this.rackets_acel[1] = this.playerL.racket.y - this.rackets_ypos[1];
        this.rackets_ypos[0] = this.playerR.racket.y;
        this.rackets_ypos[1] = this.playerL.racket.y;
        if (this.ball.y >= this.playerL.racket.y
            && this.ball.y <= this.playerL.racket.y + racket_height
            && this.ball.x - ballR <= this.playerL.racket.x + racket_width
            && this.ballSpeedX < 0) {
            this.ballSpeedX = -this.ballSpeedX;
            this.ballSpeedY = 0.4 * this.rackets_acel[0] + this.ballSpeedY + 0.002 * (1 - 2 * Math.random()) * ballSpeed;
        }
        else if (this.ball.y >= this.playerR.racket.y
            && this.ball.y <= this.playerR.racket.y + racket_height
            && this.ball.x + ballR >= this.playerR.racket.x
            && this.ballSpeedX > 0) {
            this.ballSpeedX = -this.ballSpeedX;
            this.ballSpeedY = 0.4 * this.rackets_acel[1] + this.ballSpeedY + 0.002 * (1 - 2 * Math.random()) * ballSpeed;
        }
        if (Math.abs(this.ballSpeedY) > 1.6 * ballSpeed)
            this.ballSpeedY = Math.sign(this.ballSpeedY) * 1.6 * ballSpeed;
        if (this.ball.x < ballR) {
            ++this.playerR.score;
            this.gameService.changeScore(this.roomN, this.playerR.score, this.playerL.score);
            this.ball.x = width / 2 - this.ballSpeedX;
            this.ball.y = (0.25 + 0.5 * Math.random()) * height;
            ballSpeed += ballDeltaSpeed;
            this.ballSpeedX = ballSpeed;
        }
        else if (this.ball.x > width - ballR) {
            this.ballSpeedX = -this.ballSpeedX;
            ++this.playerL.score;
            this.gameService.changeScore(this.roomN, this.playerR.score, this.playerL.score);
            this.ball.x = width / 2 - this.ballSpeedX;
            this.ball.y = (0.25 + 0.5 * Math.random()) * height;
            ballSpeed += ballDeltaSpeed;
            this.ballSpeedX = -ballSpeed;
        }
        else if ((this.ball.y < ballR && this.ballSpeedY < 0)
            || (this.ball.y > height - ballR && this.ballSpeedY > 0)) {
            this.ballSpeedY = -this.ballSpeedY;
        }
        this.ball.x += this.ballSpeedX;
        this.ball.y += this.ballSpeedY;
    }
    initMoveEvents() {
        this.userSockets.onFromId(this.playerR.user.id, 'move', (message) => {
            if (message == 'up') {
                if (this.playerR.racket.y > 0) {
                    this.playerR.racket.y -= racketSpeedY;
                }
                this.emit2all();
            }
            else if (message == 'down') {
                if (this.playerR.racket.y < height - racket_height) {
                    this.playerR.racket.y += racketSpeedY;
                }
                this.emit2all();
            }
        });
        this.userSockets.onFromId(this.playerL.user.id, 'move', (message) => {
            if (message == 'up') {
                if (this.playerL.racket.y > 0) {
                    this.playerL.racket.y -= racketSpeedY;
                }
                this.emit2all();
            }
            else if (message == 'down') {
                if (this.playerL.racket.y < height - racket_height) {
                    this.playerL.racket.y += racketSpeedY;
                }
                this.emit2all();
            }
        });
    }
    async save_results2DB() {
        const game = await this.gameService.create({
            playerOneId: this.playerR.user.id,
            playerTwoId: this.playerL.user.id,
            winnerId: this.winners.winner.id,
            score1: this.playerR.score,
            score2: this.playerL.score,
        });
    }
    destroy_game() {
        this.isrunning = false;
        this.userSockets.offFromId(this.playerR.user.id, 'move', (message) => { });
        this.userSockets.offFromId(this.playerL.user.id, 'move', (message) => { });
        this.gameService.updateStatusGameOver(this.playerL.user.id);
        this.gameService.updateStatusGameOver(this.playerR.user.id);
        this.winners.playerL = (this.playerL.user == this.winners.winner ? this.winners.winner : this.playerL.user);
        this.winners.playerR = (this.playerR.user == this.winners.winner ? this.winners.winner : this.playerR.user);
        this.server.to(this.room).emit('winner', { winner: this.winners.winner, playerR: this.winners.playerR, playerL: this.winners.playerL });
        this.userSockets.leaveRoom(this.room);
        this.gameService.removeRoom(this.roomN);
    }
    run() {
        this.isrunning = true;
        this.gameService.updateStatusGame(this.playerL.user.id);
        this.gameService.updateStatusGame(this.playerR.user.id);
        this.interval = setInterval(() => {
            this.updatePositions();
            this.emit2all();
            if ((this.playerL.score >= MAX_SCORE || this.playerR.score >= MAX_SCORE)) {
                clearInterval(this.interval);
                this.winners.winner = this.playerL.score > this.playerR.score ? this.playerL.user : this.playerR.user;
                this.save_results2DB();
                this.destroy_game();
                this.interval = null;
            }
        }, period);
    }
    exitGame(player) {
        clearInterval(this.interval);
        if (player.id == this.playerR.user.id) {
            this.playerL.score = MAX_SCORE;
            this.winners.winner = this.playerL.user;
        }
        else {
            this.playerR.score = MAX_SCORE;
            this.winners.winner = this.playerR.user;
        }
        this.save_results2DB();
        this.destroy_game();
        this.interval = null;
    }
}
exports.GameRoom = GameRoom;
//# sourceMappingURL=game.class.js.map