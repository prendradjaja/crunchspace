// Modify at will
export const GRAVITY = 2000;
export const LIFT = 70;
export const MAX_CLIMB_SPEED = 700;
export const HORIZONTAL_SPEED = 1000;

// Careful! Modifying below this line may break stuff -------------------------
export const WIDTH = 1918;
export const HEIGHT = 1438;
export const WALL_WIDTH = 120;

// Measured (at scale 0.353) as 416 to 303
const caveHeight = {
  // in pixels
  EASY: 1178,
  HARD: 858,
};

// Measured (at scale 0.353) as 20 to 130
const maxDeltaY = {
  // in pixels
  EASY: 57,
  HARD: 368,
};

const minDeltaX = {
  // in blocks
  EASY: 8,
  HARD: 1,
};

const MAX_DIFFICULTY_DISTANCE = 700; // in distance
