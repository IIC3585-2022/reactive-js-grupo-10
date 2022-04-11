import { Observable, BehaviorSubject } from 'rxjs';
import { animationFrame } from 'rxjs/scheduler/animationFrame';
import { timeInterval } from 'rxjs/operators';
import { checkEndCondition, createCanvasElement, render } from "./canvas";
import { DIRECTIONS, FPS, POINTS_PER_DOT, PACMAN_SPEED, GHOST_SPEED, SCARE_TIME } from "./constants";
import { generateApples, generatePacman, generatePower, move, nextDirection, eat, eatPower, generateGhost, 
    wallColission, generateWalls, moveGhosts, ghostColission  } from "./utils";
  

const INITIAL_DIRECTION = DIRECTIONS[ 38 ];

const canvas = createCanvasElement();
const ctx = canvas.getContext( '2d' );
document.body.appendChild( canvas );
const ghosts = ["red","pink","orange","cyan"].map((color, index) => generateGhost(index, color))

console.log(ghosts)
let keyDown$ = Observable.fromEvent( document.body, 'keydown' );


let tick$ = Observable.interval( PACMAN_SPEED );
let ghostTick$ = Observable.interval( GHOST_SPEED );
const seconds$ = Observable.interval(1000);

seconds$.pipe(timeInterval()).share()

let direction$ = keyDown$
    .map( ( e ) => DIRECTIONS[ e.keyCode ] )
    .filter( direction => !!direction )
    .startWith( INITIAL_DIRECTION )
    .distinctUntilChanged();

let length$ = new BehaviorSubject(  );

let walls$ = tick$.scan(wallColission, generateWalls()).distinctUntilChanged().share()

let pacman$ = tick$
    .withLatestFrom( direction$, walls$, ( _, direction, walls ) => ({ direction, walls }) )
    .scan( move, generatePacman() )
    .share();


const bonus$ = pacman$.scan(eatPower, generatePower()).distinctUntilChanged().share()
const bonusTaken$ = bonus$.scan(function(prevNumber, bonus) {
    return prevNumber + 1;
}, -1).timestamp();
const bonusEnd$ = bonusTaken$.skip(1).delay(SCARE_TIME).timestamp().startWith({
    timestamp: 0
});

let ghosts$ = ghostTick$
    .withLatestFrom(pacman$, walls$, bonusTaken$, bonusEnd$, ( _, pacmanPos, walls, bonusTaken, bonusEnd ) => ({ pacmanPos, walls, bonusTaken, bonusEnd }))
    .scan( moveGhosts, ghosts )
    .share();



let apples$ = pacman$
    .scan( eat, generateApples() )
    .distinctUntilChanged()
    .share()
;



/* let game$ = Observable.interval( 1000/ FPS )
    .withLatestFrom( scene$, ( _, scene ) => scene )
    .takeWhile( scene => checkEndCondition( scene.apples, scene.powers ) )
; */

let applesEaten = apples$
    .skip( 1 )
    .map( _ => 1 )
    .do(length$.next.bind(length$))
    .subscribe();

let score$ = length$
    .skip( 1 )
    .startWith( 0 )
    .scan( ( score, _ ) => score + POINTS_PER_DOT );



    let scene$ = Observable.combineLatest( pacman$, apples$, score$, bonus$, ghosts$, walls$,
        ( pacman, apples, score, powers, ghosts, walls ) => ({ pacman, apples, score , powers, ghosts, walls}) );
    

let game$ = Observable.interval( 1000/ FPS )
    .withLatestFrom( scene$, ( _, scene ) => scene )
    .takeWhile( scene => (
        checkEndCondition( scene.apples, scene.powers ) && 
        ghostColission( scene.pacman, scene.ghosts, scene.powerState))) ;

game$.subscribe( {
    next: ( scene ) => render( ctx, scene ),
    complete: console.log
} );


