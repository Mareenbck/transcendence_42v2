import React, {useRef, useEffect, useState} from 'react'
import './Game.css'
import type {gameInit, gameState, gameWinner} from './type'

const Canvas = (props: {gamestate: gameState, gameinit: gameInit, gamewinner: gameWinner} ): JSX => {
    const gamestate = props.gamestate;
    const gameinit = props.gameinit;
    const gamewinner = props.gamewinner;
 
    const canvasRef = useRef<HTMLCanvasElement>(null);  
    
    useEffect(() => {
        if (canvasRef.current){
            const context = canvasRef.current.getContext('2d');

            if (context ) {
                // Draw the table
                context.fillStyle = "black";
                context.fillRect(0, 0, gameinit.table_width, gameinit.table_height);

                // center dotted line
                context.setLineDash([5, 5]);
                context.beginPath();
                context.moveTo(gameinit.table_width/2, 0);
                context.lineTo(gameinit.table_width/2, gameinit.table_height);
                context.strokeStyle = "white";
                context.stroke();

                // Draw the ball
                context.beginPath();
                context.arc(gamestate.ball.x, gamestate.ball.y, gameinit.ballR, 0, Math.PI * 2);
                context.fillStyle = "white";
                context.fill();
                context.closePath();

                // Draw the rackets
                context.fillStyle = "white";
                context.fillRect(gamestate.racket1.x, gamestate.racket1.y, gameinit.racket_width, gameinit.racket_height);
                context.fillRect(gamestate.racket2.x, gamestate.racket2.y, gameinit.racket_width, gameinit.racket_height);

                //Score
                context.font = "40px Verdana";
                context.lineWidth = 2;
                context.fillText(`${gamestate.left}`, gameinit.table_width/2 - 80, 50);
                context.fillText(`${gamestate.right }`, gameinit.table_width/2 + 50, 50);
            

                if (gamewinner.leave){
                    // context.fillStyle = "#FDD9";
                    // context.fillRect(0, 0, gameinit.table_width, gameinit.table_height);
                    // context.closePath();

                    context.font = "40px Verdana";
                    context.lineWidth = 2;
                    context.fillText(`${gamewinner.leave}`, 100, gameinit.table_height/2);
                    context.fillText("left the game" , gameinit.table_width/2 + 100, gameinit.table_height/2);
                }
                //if winner
                if (gamewinner.winner){
                    // context.fillStyle = "#FDD9";
                    // context.fillRect(0, 0, gameinit.table_width, gameinit.table_height);
                    // context.closePath();

                    context.font = "40px Verdana";
                    context.lineWidth = 2;
                    context.fillText("WINNER:", 100, gameinit.table_height - 100);
                    context.fillText(`${gamewinner.winner}`, gameinit.table_width/2 + 100, gameinit.table_height - 100);
                }
            }
        }

    }, [gamestate, gamewinner]);
     
    return (<canvas className='field' ref={canvasRef} width={gameinit.table_width} height={gameinit.table_height} />)
}
export default Canvas


// interface game {
//     width: number;
//     height: number;
//     ballx: number;
//     bally: number;
//     racket1y: number;
//     racket2y: number;
// }

    
// const Canvas = (props: {gamestate: gameState, gameinit: gameInit} ) => {
//     const gamestate = props.gamestate;
//     const gameinit = props.gameinit;

//     const canvasRef = useRef<HTMLCanvasElement>(null);  

//     const [width, setWidth] = useState<number>(400);
//     const [height, setHeight] = useState<number>(300);
//     const [ballRadius, setBallradius] = useState<number>(15);
//     const [racketWidth, setRacketwidth] = useState<number>(10);
//     const [racketHeight, setRacketheight] = useState<number>(100);

//     useEffect(() => {
// console.log('gameinit');
//         setWidth(gameinit.table_width);
//         setHeight(gameinit.table_height);
//         setBallradius(gameinit.ballR);
//         setRacketwidth(gameinit.racket_width);
//         setRacketheight(gameinit.racket_height);
//     }, [gameinit]);

//     const update = (context: CanvasRenderingContext2D): void =>{
// //console.log('update');
//         // Draw the table
//         context.fillStyle = "black";
//         context.fillRect(0, 0, width, height);

//         // center dotted line
//         context.setLineDash([5, 5]);
//         context.beginPath();
//         context.moveTo(width/2, 0);
//         context.lineTo(width/2, height);
//         context.strokeStyle = "white";
//         context.stroke();

//         // Draw the ball
//         context.beginPath();
//         context.arc(gamestate.ball.x, gamestate.ball.y, ballRadius, 0, Math.PI * 2);
//         context.fillStyle = "white";
//         context.fill();
//         context.closePath();

//         // Draw the rackets
//         context.fillStyle = "white";
//         context.fillRect(gamestate.racket1.x, gamestate.racket1.y, racketWidth, racketHeight);
//         context.fillRect(gamestate.racket2.x, gamestate.racket2.y, racketWidth, racketHeight);

//         context.fillText(("Player 1: 0"), 100, 100);
//         context.fillText(("Player 2: 0"), width - 150, 100);
//     };
    
//     useEffect(() => {
//         if (canvasRef.current) {
//             const context = canvasRef.current.getContext('2d');
//             if(context)
//                 update(context);
//         }
//     }, [gamestate]);
    
//     return (<canvas className='field' ref={canvasRef} width={width} height={height} />)
// }