
import { Observable, BehaviorSubject } from 'rxjs';

import { animationFrame } from 'rxjs/scheduler/animationFrame';

import { checkGhostCollision, createCanvasElement, render } from "./canvas";
import { DIRECTIONS, FPS, POINT_COUNT, GHOST_SPEED, WEAK_SPEED, SPEED } from "./constants";
import { generateApples, generateSnake, move, nextDirection, eat } from "./utils";

const INITIAL_DIRECTION = DIRECTIONS[ 40 ];

const canvas = createCanvasElement();
const ctx = canvas.getContext( '2d' );
document.body.appendChild( canvas );

let keyDown$ = Observable.fromEvent( document.body, 'keydown' );

let tick$ = Observable.interval( SPEED );

let direction$ = keyDown$
    .map( ( e ) => DIRECTIONS[ e.keyCode ] )
    .filter( direction => !!direction )
    .startWith( INITIAL_DIRECTION )
    .scan( nextDirection )
    .distinctUntilChanged();


let scene$ = Observable.combineLatest( pacman$, points$, ghosts$, ( pacman, points, ghosts ) => ({ pacman, points, ghosts }) );

let game$ = Observable.interval( 1000 / FPS, animationFrame )
    .withLatestFrom( scene$, ( _, scene ) => scene )
    .takeWhile( scene => checkGhostCollision( scene.pacman, scene.ghosts) )
;

game$.subscribe( {
    next: ( scene ) => render( ctx, scene ),
    complete: console.log
} );