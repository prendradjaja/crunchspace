// Modify at will
export const GRAVITY = 2000;
export const LIFT = 70;
export const MAX_CLIMB_SPEED = 700;
export const HORIZONTAL_SPEED = 1000;

export let ORIGINAL_ASSETS = true;
ORIGINAL_ASSETS = false;

export const BLOCK_LIMIT = 24; // How many block pairs to render at once?
export const GAP_HACK = 30;

// Careful! Modifying below this line may break stuff -------------------------
export const WIDTH = 1918;
export const HEIGHT = 1438;
export const WALL_WIDTH = 120;

// Measured (at scale 0.353) as 416 to 303
export const caveHeightRange = {
  // in pixels
  EASY: 1178,
  HARD: 858,
};

// Measured (at scale 0.353) as 20 to 130
export const maxDeltaYRange = {
  // in pixels
  EASY: 57,
  HARD: 368,
};

export const minDeltaXRange = {
  // in blocks
  EASY: 8,
  HARD: 1,
};

export const MAX_DELTA_X = 16; // in blocks

export const MAX_DIFFICULTY_DISTANCE = 203; // in blocks
// export const MAX_DIFFICULTY_DISTANCE = 5;

// The cave shouldn't actually touch the top or bottom of the viewport --
// MARGIN is how close it's allowed to get.
export const MARGIN = 30; // in pixels
