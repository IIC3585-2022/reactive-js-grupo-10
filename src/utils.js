import { POINT_COUNT, POWER_COUNT, DIRECTIONS, DIRECTIONS2, GHOST_PROBABILITY_RANDOM } from "./constants";
import { COLS, ROWS, checkCollision, CANVAS_WIDTH, CANVAS_HEIGHT } from './canvas';
import { BOARD } from './board';

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

export function generatePacman2() {
    let pac = [];

    pac2.push( { x: COLS/2, y: ROWS/2 } );

    return pac;
}

export function move2( pac, { direction } ) {
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

export function generateGhost(index, color) {
    let ghost = [];
    if (index < 3) {
        ghost.push( { x: COLS+(index-1*10) , y: 1, color : color} );
        return ghost;
    }
    ghost.push( { x: COLS+(index-2*10), y: ROWS+1 , color : color} );
    console.log(ghost)
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
export function moveGhosts( ghosts, { pacmanPos } ) {
    return ghosts.map(ghost => {
        let nx = ghost[ 0 ].x;
        let ny = ghost[ 0 ].y;
        let color = ghost[0].color;
        let direction;
        if (Math.random() > GHOST_PROBABILITY_RANDOM) {
            direction = getMoveTowards(ghost, pacmanPos);
        } else {
            direction = getRandomMove();
        }
        nx += direction.x ;
        ny += direction.y;
        ghost.pop();

        let newpos = {};
        newpos.x = nx;
        newpos.y = ny;
        newpos.color = color;

        ghost.push( newpos );
        return ghost;
    })
    
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
    console.log(apples)
    return apples;
}

export function generateWalls() {
    let walls = [];

    for ( let i = 0; i < BOARD[1]; i++ ) {
        for ( let j = 0; j < BOARD[0]; j++ ) {
            if (BOARD[2][i][j] == "x"){
                walls.push({x:j, y:i})
            }
        }
    }

    console.log(walls)
    return walls;
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
        x: getRandomInt(2, COLS - 2),
        y: getRandomInt(2, ROWS - 2)
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

export function wallColission( powers, pac ) {
    let head = pac[ 0 ];

    for ( let i = 0; i < powers.length; i++ ) {
        if ( checkCollision( powers[ i ], head ) ) {
            powers.splice( i, 1 );
            return [ ...powers ];
        }
    }

    return powers;
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

export function ghostColission( pac , ghosts, powerState ) {
    console.log(powerState)
    if (powerState){
        for ( let i = 0; i < ghosts.length; i++ ) {
            if ( checkCollision( ghosts[ i ][0], pac[0] ) ) {
                ghosts.splice( i, 1 );
                return [ ...ghosts ];
            }
        }
    }
    const colission = ghosts.some(ghost => checkCollision( ghost[0], pac[0] ) )
    return !colission;
}
