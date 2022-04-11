import { POINT_COUNT, POWER_COUNT, DIRECTIONS, GHOST_PROBABILITY_RANDOM } from "./constants";
import { COLS, ROWS, checkCollision, CANVAS_WIDTH, CANVAS_HEIGHT } from './canvas';
import { BOARD } from './board';

export function generatePacman() {
    let pac = [];

    pac.push( { x: 20, y: 6 } );

    return pac;
}

export function move( pac, { direction, walls } ) {
    let nx = pac[ 0 ].x;
    let ny = pac[ 0 ].y;
    nx += direction.x;
    ny += direction.y;


    let newpos = {};
    newpos.x = nx;
    newpos.y = ny;

    const colission = walls.some(wall => checkCollision( wall, newpos ) )
    if (colission){
        return pac;
    } else{

        pac.pop();

        pac.push( newpos );

        return pac;
    }
}

export function generateGhost(index, color) {
    const firstIndex = 16;
    let ghost = [];
    ghost.push( { x: firstIndex+index, y: 10 , color : color, direction: {x:0,y:-1}, scared:false} );
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
export function moveGhosts( ghosts, { pacmanPos, walls, bonusTaken, bonusEnd} ) {
    return ghosts.map(ghost => {
        let scared = bonusTaken.value > 0 && bonusTaken.timestamp > bonusEnd.timestamp;        
        let nx = ghost[ 0 ].x;
        let ny = ghost[ 0 ].y;
        let color = ghost[0].color;
        let direction;
        if (Math.random() > GHOST_PROBABILITY_RANDOM) {
            direction = getMoveTowards(ghost, pacmanPos);
        } else {
            direction = ghost[0].direction;
        }
        nx += direction.x ;
        ny += direction.y;

        let newpos = {};
        newpos.x = nx;
        newpos.y = ny;
        newpos.color = color;
        newpos.direction = direction;
        newpos.scared = scared;
        let colission = walls.some(wall => checkCollision( wall, newpos ) )
        while (colission) {
            direction = getRandomMove();
            nx = ghost[ 0 ].x;
            ny = ghost[ 0 ].y;
            nx += direction.x ;
            ny += direction.y;
            newpos.x = nx;
            newpos.y = ny;
            newpos.color = color;
            newpos.direction = direction;
            colission = walls.some(wall => checkCollision( wall, newpos ) )
        }
        ghost.pop();
        ghost.push( newpos );
        return ghost;
    })
    
}

export function nextDirection( previous, next ) {
    /* const isOpposite = ( previous, next ) => {
        return next.x === -previous.x || next.y === -previous.y;
    };

    if ( isOpposite( previous, next ) ) {
        return previous;
    } */

    return next;
}

export function generateApples() {
    let apples = [];

    for ( let i = 0; i < BOARD[1]; i++ ) {
        for ( let j = 0; j < BOARD[0]; j++ ) {
            if (BOARD[2][i][j] == " "){
                apples.push({x:j, y:i})
            }
        }
    }
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

    return getRandomPosition(pac);
}

function isEmptyCell( position, pac ) {
    if (BOARD[2][position.y][position.x] == " "){
        return true
    }
    return false
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

export function wallColission( walls, pac ) {
    return walls;
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

export function ghostColission( pac , ghosts ) {
    if (ghosts.every((ghost => ghost[0].scared))){
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
