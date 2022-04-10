import { POINT_COUNT, POWER_COUNT, DIRECTIONS, GHOST_PROBABILITY_RANDOM } from "./constants";
import { COLS, ROWS, checkCollision, CANVAS_WIDTH, CANVAS_HEIGHT } from './canvas';

export function generatePacman() {
    let pac = [];

    pac.push( { x: COLS/2, y: ROWS/2 } );

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

export function generateGhost() {
    let ghost = [];
    ghost.push( { x: 40, y: 40 } );

    return ghost;
}

function getMoveTowards(from, to) {
    let xDiff = from.x - to.x;
    let yDiff = from.y - to.y;
    let direction = '';
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            direction = DIRECTIONS[37];
        } else {
            direction = DIRECTIONS[39];
        }
    } else {
        if (yDiff > 0) {
            direction = DIRECTIONS[38];
        } else {
            direction = DIRECTIONS[40];
        }
    }
    return direction;
}
const getRandomMove = () => {
    const random = Math.trunc(getRandomInt(37,40))
    return  DIRECTIONS[random]
}
// recibe la posición del fantasma y la del pacman, así podróa moverse en direccion al fantasma
export function moveGhost( ghost, { pacmanPos } ) {
    let nx = ghost[ 0 ].x;
    let ny = ghost[ 0 ].y;
    let direction;
    if (Math.random() > GHOST_PROBABILITY_RANDOM) {
        direction = getMoveTowards(ghost, pacmanPos);
        //console.log(pacmanPos)
    } else {
        direction = getRandomMove();
    }
    nx += direction.x ;
    ny += direction.y;
    ghost.pop();

    let newpos = {};
    newpos.x = nx;
    newpos.y = ny;

    ghost.push( newpos );

    return ghost;
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
        x: getRandomInt(0, COLS - 1),
        y: getRandomInt(0, ROWS - 1)
    };

    if (isEmptyCell(position, pac)) {
        return position;
    }

    return getRandomInt(pac);
}

function isEmptyCell( position, pac ) {
    return !pac.some( segment => checkCollision( segment, position ) );
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

export function ghostColission(pac, ghost  ) {
    
    if ( checkCollision( ghost[0], pac[0] ) ) {
        //console.log(head)
        //console.log(ghost.y)
        return false
    }
    return true;
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
