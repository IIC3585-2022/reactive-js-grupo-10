export const COLS          = 40;
export const ROWS          = 40;
export const GAP_SIZE      = 1;
export const CELL_SIZE     = 10;
export const CANVAS_WIDTH  = COLS * ( CELL_SIZE + GAP_SIZE );
export const CANVAS_HEIGHT = ROWS * ( CELL_SIZE + GAP_SIZE );
const SPACE_SIZE = 20;
const OFFSET = 20;
export const WALL_WIDTH = CANVAS_WIDTH-OFFSET
export const WALL_HEIGHT = CANVAS_HEIGHT-OFFSET
const halfHeight = Math.trunc(WALL_HEIGHT/2)
const halfWidth = Math.trunc(WALL_WIDTH/2)
const drawSquare = (ctx) => {
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'blue'
    ctx.strokeRect(10, 10, WALL_WIDTH, WALL_HEIGHT);
    // espacio izq
    ctx.moveTo(10, halfHeight-SPACE_SIZE);
    ctx.lineTo(10,halfHeight+SPACE_SIZE)
    //espacio abajo
    ctx.moveTo(halfWidth-SPACE_SIZE, WALL_HEIGHT+10);
    ctx.lineTo(halfWidth+SPACE_SIZE,WALL_HEIGHT+10);
    //espacio derecha
    ctx.moveTo(WALL_WIDTH+10, halfHeight-25);
    ctx.lineTo(WALL_WIDTH+10,halfHeight+25);
    //espacio arriba
    ctx.moveTo(halfWidth-25, OFFSET-10);
    ctx.lineTo(halfWidth+25, OFFSET-10);
    ctx.strokeStyle = 'black'
    ctx.stroke();
    
}

export function createCanvasElement() {
    const canvas = document.createElement( 'canvas' );
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT + 100;    
    return canvas;
}

export function render( ctx, scene ) {
    renderBackground( ctx, scene.score );
    renderPac( ctx, scene.pacman );
    renderPoints( ctx, scene.apples );
    renderPower( ctx, scene.powers);
    scene.ghosts.forEach(ghost => renderGhost(ctx, ghost, scene.powerState))
    drawSquare(ctx)
}

export function renderBackground( ctx, score ) {
    ctx.fillStyle = 'rgba( 0,0,0, .2 )';
    ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT + 400 );

    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText( `Score: ${score}`, 40, CANVAS_HEIGHT + 70 );
}

export function renderWalls( ctx, walls){

}

export function renderPac( ctx, pacman ) {
    paintCell( ctx, wrapBounds( pacman[0] ), "yellow");
}

export function renderGhost(ctx, ghost, powerState) {

    paintCell( ctx, wrapBounds( ghost[0] ), powerState ? 'blue': ghost[0].color);
}

export function renderPoints( ctx, points ) {
    points.forEach( point => {
        paintSmall( ctx, point, 'white' );
    } );
}

export function renderPower( ctx, powers ) {
    powers.forEach( power => {
        paintCell( ctx, power, 'white' );
    } );
}

export function paintCell( ctx, point, color ) {
    const x = point.x * ( CELL_SIZE + GAP_SIZE );
    const y = point.y * ( CELL_SIZE + GAP_SIZE );

    ctx.fillStyle = color;
    ctx.fillRect( x, y, CELL_SIZE, CELL_SIZE );
}

export function paintSmall( ctx, point, color ) {
    const x = point.x * ( CELL_SIZE + GAP_SIZE );
    const y = point.y * ( CELL_SIZE + GAP_SIZE );

    ctx.fillStyle = color;
    ctx.fillRect( x + CELL_SIZE/4, y + CELL_SIZE/4, CELL_SIZE/2, CELL_SIZE/2 );
}
export function wrapBounds( point ) {
    const y_condition = (point.y >= (ROWS/2)-3) && (point.y <= ROWS/2)
    const x_condition = (point.x >= (COLS/2)-3)&& (point.x <= COLS/2)
    const isAtRightSpace = point.x >= COLS-2 && y_condition
    const isAtLeftSpace = point.x < 1 && y_condition
    const isAtUpperSpace = point.y < 1 && x_condition
    const isAtLowerSpace = point.y >= ROWS-1 && x_condition
    const isAtSideBound = (x) => x < 1 ? 1 : x > COLS-2 ? COLS-2 : x
    const isAtLongBound = (y) => y < 1 ? 1 : y > ROWS-2 ? ROWS-2 : y
    //console.log(isAtRightBound)
    const x = isAtRightSpace ? 1 : isAtLeftSpace ? COLS - 3 : isAtSideBound(point.x)
    const y = isAtLowerSpace ? 1 : isAtUpperSpace ? ROWS - 3 : isAtLongBound(point.y);
    point.x = x;
    point.y = y;

    return point;
}

export function checkCollision(a, b) {
    return a.x === b.x && a.y === b.y;
}

export function checkEndCondition( apples, points ) {
    return (apples.length > 0 || points.length > 0);
}