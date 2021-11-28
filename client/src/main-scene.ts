import Phaser, { Types as PT } from "phaser";

import { WIDTH, HEIGHT, GRAVITY, LIFT, MAX_CLIMB_SPEED } from "./constants";

// I wish I could infer type after declaration, but I guess I can't :(
// https://stackoverflow.com/questions/54541049/infer-typescript-type-from-assignment-after-declaration
function initFields(this: MainScene) {
  return {
    player: this.physics.add.sprite(WIDTH * 0.6, HEIGHT * 0.5, "player"),
    cursors: this.input.keyboard.createCursorKeys(),
    pointer: this.game.input.mousePointer,
  };
}

export class MainScene extends Phaser.Scene {
  // Ignore "not assigned in constructor" error
  // @ts-ignore
  fields: ReturnType<typeof initFields>;

  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("wall", "assets/wall.png");
    this.load.image("tall-wall", "assets/tall-wall.png");
    this.load.image("dot", "assets/dot.png");
  }

  create() {
    this.fields = initFields.bind(this)();
    const $ = this.fields;
    $.player.setCollideWorldBounds(true);
  }

  update() {
    const $ = this.fields;
    if ($.cursors.space.isDown || $.pointer.isDown) {
      $.player.body.gravity.y = GRAVITY;
      // It feels kinda sudden to instantly stop accelerating at MAX_CLIMB_SPEED. Does the original game smooth that out?
      $.player.setVelocityY(
        Math.max($.player.body.velocity.y - LIFT, -MAX_CLIMB_SPEED)
      );
    }
  }
}
