import Phaser, { Types as PT } from "phaser";

import {
  WIDTH,
  HEIGHT,
  GRAVITY,
  LIFT,
  MAX_CLIMB_SPEED,
  HORIZONTAL_SPEED,
  WALL_WIDTH,
  ORIGINAL_ASSETS,
  GAP_HACK,
  BLOCK_LIMIT,
  POINTS_PER_SECOND,
  HIGH_SCORE_KEY,
} from "./constants";
import { take, randomInt } from "./util";
import { makeCaveShapeGenerator } from "./cave-shape-generator";

// I wish I could infer type after declaration, but I guess I can't :(
// https://stackoverflow.com/questions/54541049/infer-typescript-type-from-assignment-after-declaration
function initFields(this: MainScene) {
  return {
    player: this.physics.add.sprite(WIDTH * 0.2, HEIGHT * 0.5, "player"),
    cave: this.physics.add.group(),
    walls: this.physics.add.group(),
    cursors: this.input.keyboard.createCursorKeys(),
    pointer: this.game.input.mousePointer,
    caveShapeGenerator: makeCaveShapeGenerator(),
    started: false,
    stopped: false,
    emitter: this.add.particles("dot").createEmitter({
      speedX: -HORIZONTAL_SPEED,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
      lifespan: 500,
      frequency: 50,
    }),
    startTimeMillis: undefined as number | undefined,
    score: this.add
      .text(0, 0, localStorage.getItem(HIGH_SCORE_KEY) || "", {
        fontSize: "90px",
        color: "black",
        backgroundColor: "white",
      })
      .setDepth(1),
    lastScore: undefined as string | undefined,
  };
}

let HIDE_PLAYER = false;
// HIDE_PLAYER = true;

let HIDE_CAVE = false;
HIDE_CAVE = true;

type Fields = ReturnType<typeof initFields>;

export class MainScene extends Phaser.Scene {
  // Ignore "not assigned in constructor" error
  // @ts-ignore
  fields: Fields;

  constructor() {
    super({ key: "MainScene" });
    console.log("ctor");
  }

  preload() {
    this.load.image(
      "player",
      ORIGINAL_ASSETS ? "assets/player.png" : "assets/ship-with-dog.png"
    );
    this.load.image("wall", "assets/wall.png");
    this.load.image("tall-wall", "assets/tall-wall.png");
    this.load.image("dot", "assets/dot.png");
  }

  create() {
    const globals = window as any;
    globals.scene = this;
    globals.camera = this.cameras.cameras[0];
    // globals.camera.setZoom(0.2);

    // this.add.image(WIDTH * 0.2, HEIGHT * 0.8, "wall"),

    this.fields = initFields.bind(this)();
    const $ = this.fields;

    if (!HIDE_PLAYER) {
      $.player.setGravityY(GRAVITY);
      $.player.setCollideWorldBounds(true);
    } else {
      $.player.setY(-5000);
    }
    if (!ORIGINAL_ASSETS) {
      $.player.setScale(4);
      const hitboxScale = 0.8;
      $.player.body.setSize(55 * hitboxScale, 37 * hitboxScale);
    }

    this.addFirstWall();
    this.appendWall();
    // this.appendWall();

    this.addFirstCaveBlockPair();
    for (let i = 0; i < BLOCK_LIMIT; i++) {
      this.appendCaveBlockPair();
    }
    this.physics.add.overlap($.player, $.cave, this.onHit.bind(this));
    this.physics.add.overlap($.player, $.walls, this.onHit.bind(this));

    this.physics.pause();
  }

  updateWalls() {
    // const $ = this.fields;
    // if ($.walls.getFirst(true).x < WIDTH * 0.80) {
    //   const child = $.cave.getFirst(true);
    // }
  }

  maybeRemoveCaveBlockPair() {
    const $ = this.fields;
    if ($.cave.getFirst(true).x < 0) {
      for (let i = 0; i < 2; i++) {
        const child = $.cave.getFirst(true);
        $.cave.remove(child, true, true);
      }
      return true;
    } else {
      return false;
    }
  }

  maybeRemoveWall() {
    const $ = this.fields;
    if ($.walls.getFirst(true).x < 0) {
      const child = $.walls.getFirst(true);
      $.walls.remove(child, true, true);
      return true;
    } else {
      return false;
    }
  }

  addFirstCaveBlockPair() {
    const $ = this.fields;
    const x = 0;

    const equator = HEIGHT / 2;
    const ceilingY = equator - 800;
    const floorY = equator + 1600;
    $.cave
      .create(x, ceilingY, "tall-wall")
      .setOrigin(1, 0.5)
      .setVelocityX(-HORIZONTAL_SPEED);

    $.cave
      .create(x, floorY, "tall-wall")
      .setOrigin(1, 0.5)
      .setVelocityX(-HORIZONTAL_SPEED);
  }

  addFirstWall() {
    const $ = this.fields;
    $.walls
      .create(WIDTH * 1.2, HEIGHT / 2, "wall")
      .setVelocityX(-HORIZONTAL_SPEED);
  }

  appendCaveBlockPair() {
    const $ = this.fields;
    const lastWall = $.cave.getLast(true);
    const x = lastWall.x + WALL_WIDTH - GAP_HACK; //

    const item = $.caveShapeGenerator.next();
    if (item.done) {
      return;
    }
    const { ceiling, floor, segmentIndex } = item.value;
    $.cave
      .create(x, ceiling, "tall-wall")
      .setOrigin(1, 1)
      // .setAlpha(segmentIndex % 2 === 0 ? 0.6 : 0.35)
      .setVelocityX(-HORIZONTAL_SPEED);

    $.cave
      .create(x, floor, "tall-wall")
      .setOrigin(1, 0)
      // .setAlpha(segmentIndex % 2 === 0 ? 0.6 : 0.35)
      .setVelocityX(-HORIZONTAL_SPEED);
  }

  appendWall() {
    const $ = this.fields;
    const lastWall = $.walls.getLast(true);
    const x = lastWall.x + WIDTH * 0.9; //
    const y = randomInt(0, HEIGHT);

    $.walls
      .create(x, y, "wall")
      // .setAlpha(segmentIndex % 2 === 0 ? 0.6 : 0.35)
      .setVelocityX(-HORIZONTAL_SPEED);
  }

  update() {
    const $ = this.fields;
    if ($.cursors.space.isDown || $.pointer.isDown) {
      if (!$.started) {
        $.started = true;
        $.startTimeMillis = new Date().valueOf();
        this.physics.resume();
        $.emitter.startFollow($.player, -120);
      }
      // It feels kinda sudden to instantly stop accelerating at MAX_CLIMB_SPEED. Does the original game smooth that out?
      $.player.setVelocityY(
        Math.max($.player.body.velocity.y - LIFT, -MAX_CLIMB_SPEED)
      );
    }
    const offset = 300;

    const removed = this.maybeRemoveCaveBlockPair();
    if (removed) {
      this.appendCaveBlockPair();
    }

    const removedWall = this.maybeRemoveWall();
    if (removedWall) {
      this.appendWall();
    }

    if (!$.stopped && $.startTimeMillis) {
      const score = (
        ((new Date().valueOf() - $.startTimeMillis) / 1000) *
        POINTS_PER_SECOND
      )
        .toFixed(0)
        .toString();

      $.score.setText(score);
      $.lastScore = score;
    }
  }

  onHit(
    player: PT.Physics.Arcade.GameObjectWithBody,
    wall: PT.Physics.Arcade.GameObjectWithBody
  ) {
    const $ = this.fields;
    if (!$.stopped) {
      $.stopped = true;
      this.physics.pause();
      $.player.setTint(0xff0000);
      $.emitter.pause();
      localStorage.setItem(HIGH_SCORE_KEY, "Best: " + $.lastScore);
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.scene.restart();
        },
      });
    }
  }
}
