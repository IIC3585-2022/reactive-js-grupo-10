import { Observable, BehaviorSubject } from 'rxjs';
import { animationFrame } from 'rxjs/scheduler/animationFrame';

import { checkEndCondition, createCanvasElement, render } from "./canvas";
import { DIRECTIONS, FPS, POINTS_PER_DOT, SPEED } from "./constants";
import { generateApples, generatePacman, generatePower, move, nextDirection, eat, eatPower, generateGhost, moveGhost, ghostColission } from "./utils";
  

const INITIAL_DIRECTION = DIRECTIONS[ 38 ];

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

let length$ = new BehaviorSubject(  );

let pacman$ = tick$
    .withLatestFrom( direction$, ( _, direction ) => ({ direction }) )
    .scan( move, generatePacman() )
    .share();

let ghost$ = tick$
    .withLatestFrom( pacman$,( _, pacmanPos ) => ({ pacmanPos }))
    .scan( moveGhost, generateGhost() )
    .share();

let apples$ = pacman$
    .scan( eat, generateApples() )
    .distinctUntilChanged()
    .share()
;
let powers$ = pacman$.scan(eatPower, generatePower()).distinctUntilChanged().share()

let applesEaten = apples$
    .skip( 1 )
    .map( _ => 1 )
    .do(length$.next.bind(length$))
    .subscribe();

let score$ = length$
    .skip( 1 )
    .startWith( 0 )
    .scan( ( score, _ ) => score + POINTS_PER_DOT );

let scene$ = Observable.combineLatest( pacman$, apples$, score$, powers$, ghost$,
    ( pacman, apples, score, powers,ghost ) => ({ pacman, apples, score , powers,ghost}) );

let game$ = Observable.interval( 1000/ FPS )
    .withLatestFrom( scene$, ( _, scene ) => scene )
    .takeWhile( scene => (checkEndCondition( scene.apples, scene.powers ) && ghostColission( scene.pacman, scene.ghost ))) 
;

game$.subscribe( {
    next: ( scene ) => render( ctx, scene ),
    complete: console.log
} );


