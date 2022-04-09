import { POINT_COUNT, POWER_COUNT } from "./constants";
import { COLS, ROWS, checkCollision } from './canvas';

export function generatePacman() {
    let pac = [];

    pac.push( { x: 0, y: 0 } );

    return pac;
}

export function move( pac, { direction } ) {
    let nx = pac[ 0 ].x;
    let ny = pac[ 0 ].y;

    nx += direction.x;
    ny += direction.y;

    pac.pop();

    let newpos = {};
    newpos.x = nx;
    newpos.y = ny;

    pac.push( newpos );

    return pac;
}

export function nextDirection( previous, next ) {
    const isOpposite = ( previous, next ) => {
        return next.x === -previous.x || next.y === -previous.y;
    };

    if ( isOpposite( previous, next ) ) {
        return previous;
    }

    return next;
}

export function generateApples() {
    let apples = [];

    for ( let i = 0; i < POINT_COUNT; i++ ) {
        apples.push( getRandomPosition() );
    }

    return apples;
}

export function generatePower() {
    let powers = [];

    for ( let i = 0; i < POWER_COUNT; i++ ) {
        powers.push( getRandomPosition() );
    }

    return powers;
}


export function getRandomPosition(pac = []) {
    let position = {
        x: getRandomNumber(0, COLS - 1),
        y: getRandomNumber(0, ROWS - 1)
    };

    if (isEmptyCell(position, pac)) {
        return position;
    }

    return getRandomPosition(pac);
}

function isEmptyCell( position, pac ) {
    return !pac.some( segment => checkCollision( segment, position ) );
}

function getRandomNumber( min, max ) {
    return Math.floor( Math.random() * (max - min + 1) + min );
}

export function eat( apples, pac ) {
    let head = pac[ 0 ];

    for ( let i = 0; i < apples.length; i++ ) {
        if ( checkCollision( apples[ i ], head ) ) {
            apples.splice( i, 1 );
            return [ ...apples ];
        }
    }

    return apples;
}

export function eatPower( powers, pac ) {
    let head = pac[ 0 ];

    for ( let i = 0; i < powers.length; i++ ) {
        if ( checkCollision( powers[ i ], head ) ) {
            powers.splice( i, 1 );
            return [ ...powers ];
        }
    }

    return powers;
}