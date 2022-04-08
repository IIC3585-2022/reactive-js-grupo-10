export const COLS          = 30;
export const ROWS          = 30;
export const GAP_SIZE      = 1;
export const CELL_SIZE     = 10;
export const CANVAS_WIDTH  = COLS * ( CELL_SIZE + GAP_SIZE );
export const CANVAS_HEIGHT = ROWS * ( CELL_SIZE + GAP_SIZE );

const dimensionWidth = innerWidth-40
const dimensionHeight = innerHeight-40
const offset = 20;
const spaceSize = 25;
const drawSquare = (ctx) => {
    const halfHeight = Math.trunc(dimensionHeight/2)
    const halfWidth = Math.trunc(dimensionWidth/2)
    ctx.moveTo(20, 20);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'blue'
    ctx.strokeRect(20, 20, dimensionWidth, dimensionHeight);
    // espacio izq
    ctx.moveTo(20, halfHeight-spaceSize);
    ctx.lineTo(20,halfHeight+spaceSize)
    //espacio abajo
    ctx.moveTo(halfWidth+offset-spaceSize, dimensionHeight+offset);
    ctx.lineTo(halfWidth+offset+spaceSize,dimensionHeight+offset);
    //espacio derecha
    ctx.moveTo(dimensionWidth+offset, halfHeight+offset-25);
    ctx.lineTo(dimensionWidth+offset,halfHeight+offset+25);
    //espacio arriba
    ctx.moveTo(halfWidth+offset-25, offset);
    ctx.lineTo(halfWidth+offset+25, offset);
    ctx.strokeStyle = 'black'
    ctx.stroke();
    
}
export function createCanvasElement() {
    const canvas = document.createElement( 'canvas' );
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    var ctx = canvas.getContext("2d");
    drawSquare(ctx)
    return canvas;
}
