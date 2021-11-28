import Phaser, { Types as PT } from "phaser";

import {
  WIDTH,
  HEIGHT,
  GRAVITY,
  LIFT,
  MAX_CLIMB_SPEED,
  HORIZONTAL_SPEED,
  WALL_WIDTH,
} from "./constants";
import { makeCaveShapeGenerator } from "./cave-shape-generator";

// I wish I could infer type after declaration, but I guess I can't :(
// https://stackoverflow.com/questions/54541049/infer-typescript-type-from-assignment-after-declaration
function initFields(this: MainScene) {
  return {
    player: this.physics.add.sprite(WIDTH * 0.2, HEIGHT * 0.7, "player"),
    cave: this.physics.add.group(),
    cursors: this.input.keyboard.createCursorKeys(),
    pointer: this.game.input.mousePointer,
    caveShapeGenerator: makeCaveShapeGenerator(),
  };
}

let HIDE_PLAYER = false;
// HIDE_PLAYER = true;

let HIDE_CAVE = false;
// HIDE_CAVE = true;

let ORIGINAL_ASSETS = true;
ORIGINAL_ASSETS = false;

type Fields = ReturnType<typeof initFields>;

export class MainScene extends Phaser.Scene {
  // Ignore "not assigned in constructor" error
  // @ts-ignore
  fields: Fields;

  constructor() {
    super({ key: "MainScene" });
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
    }

    var particles = this.add.particles("dot");

    var emitter = particles.createEmitter({
      speedX: -HORIZONTAL_SPEED,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
      lifespan: 500,
      frequency: 50,
    });
    emitter.startFollow($.player, -120);

    if (!HIDE_CAVE) {
      for (let i = 0; i < 50; i++) {
        const WAVE_SIZE = 500;
        const x = 0.0 * WIDTH + i * WALL_WIDTH;
        const y = 500 * Math.cos((i * Math.PI * 2) / 40);
        $.cave.create(x, -800 + y + 0.5 * HEIGHT, "tall-wall");
        $.cave.create(x, 800 + y + 0.5 * HEIGHT, "tall-wall");
      }
      $.cave.setVelocityX(-HORIZONTAL_SPEED);
      this.physics.add.overlap($.player, $.cave, this.onHit.bind(this));
    }

    // let i = 0;
    // for (let item of $.caveShapeGenerator) {
    //   const x = 0.0 * WIDTH + i * WALL_WIDTH;
    //   const { equator, ceiling, floor } = item;
    //   this.add.image(x, equator, "dot");
    //   this.add.image(x, floor, "dot").setTint(0xff0000);
    //   this.add.image(x, ceiling, "dot").setTint(0x0000ff);
    //   i++;
    // }

    // this.physics.pause();
  }

  update() {
    const $ = this.fields;
    if ($.cursors.space.isDown || $.pointer.isDown) {
      // It feels kinda sudden to instantly stop accelerating at MAX_CLIMB_SPEED. Does the original game smooth that out?
      $.player.setVelocityY(
        Math.max($.player.body.velocity.y - LIFT, -MAX_CLIMB_SPEED)
      );
    }
    const offset = 300;
  }

  onHit(
    player: PT.Physics.Arcade.GameObjectWithBody,
    wall: PT.Physics.Arcade.GameObjectWithBody
  ) {
    this.scene.restart();
  }
}
