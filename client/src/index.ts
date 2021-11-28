import Phaser, { Types as PT } from "phaser";

import { MainScene } from "./main-scene";
import { WIDTH, HEIGHT, ORIGINAL_ASSETS } from "./constants";

const config: PT.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: ORIGINAL_ASSETS ? "#000000" : "#000000",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scale: { zoom: 0.353 },
  scene: [MainScene],
};

const game = new Phaser.Game(config);
