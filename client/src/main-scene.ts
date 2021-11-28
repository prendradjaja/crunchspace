import Phaser, { Types as PT } from "phaser";

import { WIDTH, HEIGHT } from "./constants";

function initFields(this: MainScene) {
  return {
    player: this.physics.add.sprite(WIDTH * 0.1, HEIGHT * 0.3, "player"),
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
    this.fields.player.body.gravity.y = 500;
    this.fields.player.setCollideWorldBounds(true);
  }

  update() {}
}
