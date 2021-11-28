import Phaser, { Types as PT } from "phaser";

import { MainScene } from "./main-scene";
import { WIDTH, HEIGHT, ORIGINAL_ASSETS, PREVIOUS_NAME_KEY } from "./constants";
import { HighScore, createHighScore, getHighScores, createScore } from "./api";
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

document.body.classList.remove("loading");
const game = new Phaser.Game(config);

showHighScores();

const globals = window as any;

function tryApi() {
  createHighScore({
    player: "example-score",
    score: randomInt(1, 100),
  });
  getHighScores().then((scores) => {
    for (let score of scores) {
      console.log(score.player, score.score);
    }
  });
}
globals.tryApi = tryApi;

const MAX_SCORES = 10;

function showHighScores(): Promise<HighScore[]> {
  const scoreboard = document.querySelector("#scoreboard")!;
  if (!scoreboard.textContent) {
    scoreboard.textContent = "(Loading high scores...)";
  }
  return getHighScores().then((scores) => {
    const paddedScores =
      scores.length === MAX_SCORES
        ? scores
        : scores.concat(
            new Array(MAX_SCORES - scores.length).fill({
              player: "-",
              score: 0,
            })
          );

    scoreboard.textContent =
      "High scores:\n\n" +
      paddedScores
        .map((item) => {
          const name = item.player.slice(0, 5).padEnd(6);
          const score = item.score.toString().padStart(5);
          return `${name} ${score}`;
        })
        .join("\n");

    return paddedScores;
  });
}

function onGameOver(myScore: number) {
  createScore({
    player: localStorage.getItem(PREVIOUS_NAME_KEY) || "anon-sys-02",
    score: myScore,
  });
  showHighScores().then((paddedScores) => {
    const worstScore = paddedScores[MAX_SCORES - 1].score;
    if (myScore > worstScore) {
      setTimeout(() => {
        const name = window
          .prompt("New high score! What's your name? (5 characters max)")
          ?.trim();
        if (name) {
          createHighScore({ player: name, score: myScore }).then(
            () => showHighScores(),
            () => window.alert("Error: Unable to save high score")
          );
          localStorage.setItem(PREVIOUS_NAME_KEY, name);
        }
      }, 0);
    }
  });
}
globals.onGameOver = onGameOver;
