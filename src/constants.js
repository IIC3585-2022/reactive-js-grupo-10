export const SNAKE_LENGTH = 1;

export const POINT_COUNT = 8;

export const POWER_COUNT = 6;

export const POINTS_PER_DOT = 10;

// Mientras mas alto el numero, mas lento va
// Milisegundos entre actualizaciones
export const PACMAN_SPEED = 200;
export const GHOST_SPEED = 400;

export const FPS = 120;

export const DIRECTIONS = {
    37: { x: -1, y:  0 },
    38: { x:  0, y: -1 },
    39: { x:  1, y:  0 },
    40: { x:  0, y:  1 },
};

export const DIRECTIONS2 = {
    65: { x: -1, y:  0 },
    87: { x:  0, y: -1 },
    68: { x:  1, y:  0 },
    83: { x:  0, y:  1 },
};

export const GHOST_PROBABILITY_RANDOM = 0.95;
export const SCARE_TIME = 10*1000; // in miliseconds
