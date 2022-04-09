import { 
    createCanvasElement, 
    halfHeight, 
    halfWidth 
  } from "./canvas";
import {
    fromEvent,
    interval,
    combineLatest,
    merge,
    animationFrameScheduler
  } from 'rxjs';

import {
    withLatestFrom,
    scan,
    map,
    distinctUntilChanged
} from 'rxjs/operators';

// import {
//     BALL_RADIUS,
//     TICKER_INTERVAL,
//     PADDLE_KEYS,
//     canvas,
//     context
//   } from './constants';
  
const PADDLE_WIDTH = 200;
const PADDLE_HEIGHT = 40;
  
const BALL_RADIUS = 20;
  
const BRICK_ROWS = 5;
const BRICK_COLUMNS = 7;
const BRICK_HEIGHT = 40;
const BRICK_GAP = 6;
  
const TICKER_INTERVAL = 17;
  
const PADDLE_SPEED = 340;
const PADDLE_KEYS = {
    left: 37,
    right: 39,
    up: 38,
    down: 40
  };
  
const BALL_SPEED = 90;
  
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');


function drawTitle() {
    context.textAlign = 'center';
    context.font = 'bold 60px Courier New';
    context.fillText('Pacman', canvas.width / 2, canvas.height / 2 - 60);
  }
  
function drawControls() {
context.textAlign = 'center';
context.font = 'bold 40px Courier New';
context.fillText(
    'Presiona para empezar',
    canvas.width / 2,
    canvas.height / 2
);
}

function drawPaddle(position) {
    context.beginPath();
    context.rect(
      position - PADDLE_WIDTH / 2,
      context.canvas.height - PADDLE_HEIGHT,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );
    context.fill();
    context.closePath();
  }
  


function movePaddle(position, ticker, direction) {
    let next = position + direction * ticker.deltaTime * PADDLE_SPEED;
    return Math.max(
      Math.min(next, canvas.width - PADDLE_WIDTH / 2),
      PADDLE_WIDTH / 2
    );
  }
  






// const canvas = createCanvasElement();
// const ctx = canvas.getContext( '2d' );
// document.body.appendChild( canvas );
// document.body.style.background = 'black';
// document.body.style.margin = 0;


// class Pacman{
//     constructor({position, velocity}) {
//         this.position = position
//         this.velocity = velocity
//         this.radius = 20
//     }
//     draw() {
//         ctx.beginPath()
//         ctx.arc(this.position.x,this.position.y,this.radius, 0, Math.PI * 2)
//         ctx.fillStyle = "yellow"
//         ctx.fill()
//         ctx.closePath()
//     }
// }

// const position = {x:halfWidth+20, y:halfHeight+20}
// const velocity = 2.10;

// const pacman = new Pacman({position, velocity})
// pacman.draw()


const ticker$ = interval(TICKER_INTERVAL, animationFrameScheduler)
    .pipe(
        map(() => ({
            time: Date.now(),
            deltaTime: null
        })),
        
        scan((previous, current) => ({
            time: current.time,
            deltaTime: (current.time - previous.time) / 1000
          }))
        
    );
// .subscribe(tick => console.log(tick));

/* Keyboard */

  
const input$ = merge(
    fromEvent(document, 'keydown', event => {
    switch (event.keyCode) {
        case PADDLE_KEYS.left:
            return -1;
        case PADDLE_KEYS.right:
            return 1;
        case PADDLE_KEYS.up:
            return 1;
        case PADDLE_KEYS.down:
            return -1;
        default:
        return 0;
    }
    }),
    fromEvent(document, 'keyup', () => 0)
);

const input2$ = merge(
    fromEvent(document, 'keydown', event => {
    switch (event.keyCode) {
        case PADDLE_KEYS.left:
            return [-1,0];
        case PADDLE_KEYS.right:
            return [1,0];
        case PADDLE_KEYS.up:
            return [0,1];
        case PADDLE_KEYS.down:
            return [0,-1];
        default:
        return 0;
    }
    }),
    fromEvent(document, 'keyup', () => 0)
).subscribe(paddle => console.log(paddle));



const paddle$ = ticker$.pipe(
    withLatestFrom(input$),
    scan(
        (position, [ticker, direction]) => movePaddle(position, ticker, direction),
        canvas.width / 2
    ),
    distinctUntilChanged()
    )


drawTitle(context, canvas);
drawControls(context, canvas);

function update(paddle) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    drawPaddle(paddle);

    
    
    }
      
      


const game = combineLatest(ticker$, paddle$).subscribe(([_,paddle]) => update(paddle));
