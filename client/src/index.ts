import Phaser, { Types as PT } from "phaser";

import { MainScene } from "./main-scene";
import { WIDTH, HEIGHT } from "./constants";

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
  scene: [MainScene],
};

const game = new Phaser.Game(config);
