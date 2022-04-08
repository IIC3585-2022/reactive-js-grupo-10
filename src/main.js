import { createCanvasElement } from "./canvas";

const canvas = createCanvasElement();
const ctx = canvas.getContext( '2d' );
document.body.appendChild( canvas );
document.body.style.background = 'black';
document.body.style.margin = 0;

