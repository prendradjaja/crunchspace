import Phaser, { Types as PT } from "phaser";

const WIDTH = 1918;
const HEIGHT = 1438;

const config: PT.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload(this: Phaser.Scene) {
  this.load.image("player", "assets/player.png");
  this.load.image("wall", "assets/wall.png");
  this.load.image("tall-wall", "assets/tall-wall.png");
  this.load.image("dot", "assets/dot.png");
}

function create(this: Phaser.Scene) {
  this.add.image(WIDTH * 0.1, HEIGHT * 0.3, "player");
  this.add.image(WIDTH * 0.2, HEIGHT * 0.3, "wall");
  this.add.image(WIDTH * 0.3, HEIGHT * 0.3, "tall-wall");
  this.add.image(WIDTH * 0.4, HEIGHT * 0.3, "dot");
}

function update(this: Phaser.Scene) {}
