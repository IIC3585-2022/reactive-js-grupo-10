import { Observable, BehaviorSubject, timeInterval } from 'rxjs';
import { animationFrame } from 'rxjs/scheduler/animationFrame';

import { checkEndCondition, createCanvasElement, render } from "./canvas";
import { DIRECTIONS, DIRECTIONS2, FPS, POINTS_PER_DOT, PACMAN_SPEED, GHOST_SPEED, SCARE_TIME } from "./constants";
import { generateApples, generatePacman, generatePower, move, nextDirection, eat, eatPower, generateGhost, 
    wallColission, generateWalls, moveGhosts, ghostColission  } from "./utils";
  

const INITIAL_DIRECTION = DIRECTIONS[ 38 ];

const canvas = createCanvasElement();
const ctx = canvas.getContext( '2d' );
document.body.appendChild( canvas );
const ghosts = [[1,"red"],[2,"pink"],[3,"orange"],[4,"cyan"]].map(i => generateGhost(i[0], i[1]))

//const ghosts = [(1,"red"),(2,"pink"),(3,"orange"),(4,"cyan")].map(i => generateGhost(i[0], i[1]))
let keyDown$ = Observable.fromEvent( document.body, 'keydown' );


let tick$ = Observable.interval( PACMAN_SPEED );
let ghostTick$ = Observable.interval( GHOST_SPEED );

let direction$ = keyDown$
    .map( ( e ) => DIRECTIONS[ e.keyCode ] )
    .filter( direction => !!direction )
    .startWith( INITIAL_DIRECTION )
    .scan( nextDirection )
    .distinctUntilChanged();

let direction2$ = keyDown$
    .map( ( e ) => DIRECTIONS2[ e.keyCode ] )
    .filter( direction => !!direction )
    .startWith( INITIAL_DIRECTION )
    .scan( nextDirection )
    .distinctUntilChanged();

let length$ = new BehaviorSubject(  );

//Instanciando ambos pacman

let pacman$ = tick$
    .withLatestFrom( direction$, ( _, direction ) => ({ direction }) )
    .scan( move, generatePacman() )
    .share();

let pacman2$ = tick$
    .withLatestFrom( direction2$, ( _, direction ) => ({ direction }) )
    .scan( move, generatePacman() )
    .share();

//---


let ghosts$ = ghostTick$
    .withLatestFrom(pacman$ && pacman2$ ,( _, pacmanPos ) => ({ pacmanPos }))
    .scan( moveGhosts, ghosts )
    .share();

let walls$ = pacman$.scan(wallColission, generateWalls()).distinctUntilChanged().share()
let walls2$ = pacman2$.scan(wallColission, generateWalls()).distinctUntilChanged().share()

let apples$ =  pacman$
    .scan( eat, generateApples() )
    .distinctUntilChanged()
    
// apples$.subscribe(pacman2 => console.log(pacman2));
let apples2$ =  pacman2$
    .scan( eat, generateApples() )
    .distinctUntilChanged()

let powers$ = pacman$.scan(eatPower, generatePower()).distinctUntilChanged().share()
let powers2$ = pacman2$.scan(eatPower, generatePower()).distinctUntilChanged().share()


let powerState$ = powers$.skip( 1 )
.startWith( false ).scan(state => true).distinctUntilChanged().share()

let powerState2$ = powers2$.skip( 1 )
.startWith( false ).scan(state => true).distinctUntilChanged().share()

const bonusEnd$ = powerState$.skip(1).delay(SCARE_TIME).timestamp().startWith({
    timestamp: 0
}).scan((state) => console.log(state));

const bonusEnd2$ = powerState2$.skip(1).delay(SCARE_TIME).timestamp().startWith({
    timestamp: 0
}).scan((state) => console.log(state));


let applesEaten = apples$
    .skip( 1 )
    .map( _ => 1 )
    .do(length$.next.bind(length$))
    .subscribe();

let score$ = length$
    .skip( 1 )
    .startWith( 0 )
    .scan( ( score, _ ) => score + POINTS_PER_DOT );

let scene$ = Observable.combineLatest( pacman$, apples$, score$, powers$, ghosts$,powerState$, walls$ ,bonusEnd$, 
    ( pacman, apples, score, powers, ghosts, powerState, walls ) => ({ pacman, apples, score , powers, ghosts, powerState, walls}) );

let scene2$ = Observable.combineLatest( pacman2$, apples2$, score$, powers2$, ghosts$,powerState2$, walls2$ ,bonusEnd2$, 
    ( pacman, apples, score, powers, ghosts, powerState, walls ) => ({ pacman, apples, score , powers, ghosts, powerState, walls}) );
    

let game$ = Observable.interval( 1000/ FPS )
    .withLatestFrom( scene$, ( _, scene ) => scene )
    .takeWhile( scene => (
        checkEndCondition( scene.apples, scene.powers ) && 
        ghostColission( scene.pacman, scene.ghosts, scene.powerState))) ;

let game2$ = Observable.interval( 1000/ FPS )
    .withLatestFrom( scene2$, ( _, scene ) => scene )
    .takeWhile( scene => (
        checkEndCondition( scene.apples, scene.powers ) && 
        ghostColission( scene.pacman, scene.ghosts, scene.powerState))) ;

game$.subscribe( {
    next: ( scene ) => render( ctx, scene ),
    complete: console.log
} );

game2$.subscribe( {
    next: ( scene ) => render( ctx, scene ),
    complete: console.log
} );
