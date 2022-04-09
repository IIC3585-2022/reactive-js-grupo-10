export const SNAKE_LENGTH = 3;

export const APPLE_COUNT = 2;

export const POINTS_PER_APPLE = 1;

export const SPEED = 100;

export const FPS = 60;

export const DIRECTIONS = {
    37: { x: -1, y:  0 },
    38: { x:  0, y: -1 },
    39: { x:  1, y:  0 },
    40: { x:  0, y:  1 },
};


export const PADDLE_WIDTH = 200;
export const PADDLE_HEIGHT = 40;

export const BALL_RADIUS = 20;

export const BRICK_ROWS = 5;
export const BRICK_COLUMNS = 7;
export const BRICK_HEIGHT = 40;
export const BRICK_GAP = 6;

export const TICKER_INTERVAL = 17;

export const PADDLE_SPEED = 340;
export const PADDLE_KEYS = {
  left: 37,
  right: 39
};

export const BALL_SPEED = 90;

export const canvas = document.querySelector('canvas');
export const context = canvas.getContext('2d');
