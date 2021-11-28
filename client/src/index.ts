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

// Ideally these would be const
let player: PT.Physics.Arcade.SpriteWithDynamicBody;

function preload(this: Phaser.Scene) {
  this.load.image("player", "assets/player.png");
  this.load.image("wall", "assets/wall.png");
  this.load.image("tall-wall", "assets/tall-wall.png");
  this.load.image("dot", "assets/dot.png");
}

function create(this: Phaser.Scene) {
  player = this.physics.add.sprite(WIDTH * 0.1, HEIGHT * 0.3, "player");
  player.body.gravity.y = 500;
  player.setCollideWorldBounds(true);
}

function update(this: Phaser.Scene) {}
