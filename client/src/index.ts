import Phaser, { Types as PT } from "phaser";

import { MainScene } from "./main-scene";
import { WIDTH, HEIGHT, ORIGINAL_ASSETS } from "./constants";
import { createHighScore } from "./api";
import { randomInt } from "./util";

const config: PT.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
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

const globals = window as any;

function tryApi() {
  createHighScore({
    player: "example-score",
    score: randomInt(1, 100),
  });
}
globals.tryApi = tryApi;
