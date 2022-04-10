export const COLS          = 40;
export const ROWS          = 15;
export const GAP_SIZE      = 1;
export const CELL_SIZE     = 10;
export const CANVAS_WIDTH  = COLS * ( CELL_SIZE + GAP_SIZE );
export const CANVAS_HEIGHT = ROWS * ( CELL_SIZE + GAP_SIZE );


export function createCanvasElement() {
    const canvas = document.createElement( 'canvas' );
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT + 100;
    return canvas;
}

export function render( ctx, scene ) {
    console.log(scene.seconds)
    renderBackground( ctx, scene.score );
    renderPac( ctx, scene.pacman );
    renderWalls( ctx, scene.walls)
    renderPoints( ctx, scene.apples );
    renderPower( ctx, scene.powers);
    scene.ghosts.forEach(ghost => renderGhost(ctx, ghost, scene.powerState))
}

export function renderBackground( ctx, score ) {
    ctx.fillStyle = 'rgba( 0,0,0, .2 )';
    ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT + 400 );

    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText( `Score: ${score}`, 40, CANVAS_HEIGHT + 70 );
}

export function renderWalls( ctx, walls){
    walls.forEach( wall => {
        paintCell( ctx, wall, 'green' );
    } );
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
    ctx.fillRect( x + CELL_SIZE/4, y + CELL_SIZE/4, CELL_SIZE/4, CELL_SIZE/4 );
}
export function wrapBounds( point ) {
    const x = point.x >= COLS ? 0 : point.x < 0 ? COLS - 1 : point.x;
    const y = point.y >= ROWS ? 0 : point.y < 0 ? ROWS - 1 : point.y;

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