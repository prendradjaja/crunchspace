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
  STAR_SPEED,
  STAR_LIFESPAN,
  STARS_ENABLED,
  COLORS_ENABLED,
} from "./constants";
import { take, randomInt, randomChoice } from "./util";
import { makeCaveShapeGenerator } from "./cave-shape-generator";

// I wish I could infer type after declaration, but I guess I can't :(
// https://stackoverflow.com/questions/54541049/infer-typescript-type-from-assignment-after-declaration
function initFields(this: MainScene) {
  return {
    player: this.physics.add.sprite(WIDTH * 0.2, HEIGHT * 0.5, "player"),
    cave: this.physics.add.group(),
    walls: this.physics.add.group(),
    cursors: this.input.keyboard.createCursorKeys(),
    pointer: this.game.input.activePointer,
    caveShapeGenerator: makeCaveShapeGenerator(),
    started: false,
    stopped: false,
    isForcedDeath: false,
    emitter: this.add.particles("dot").createEmitter({
      speedX: -HORIZONTAL_SPEED,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
      lifespan: 500,
      frequency: 50,
    }),
    starEmitters: [
      this.add.particles("dot").createEmitter({
        speedX: -STAR_SPEED,
        scale: 0.2,
        lifespan: STAR_LIFESPAN,
        quantity: 0,
      }),
      this.add.particles("dot").createEmitter({
        speedX: -STAR_SPEED,
        scale: 0.1,
        alpha: 0.7,
        lifespan: STAR_LIFESPAN,
        quantity: 0,
      }),
      this.add.particles("dot").createEmitter({
        speedX: -STAR_SPEED,
        scale: 0.1,
        lifespan: STAR_LIFESPAN,
        quantity: 0,
      }),
      this.add.particles("dot").createEmitter({
        speedX: -STAR_SPEED,
        scale: 0.05,
        alpha: 0.5,
        lifespan: STAR_LIFESPAN,
        quantity: 0,
      }),
      this.add.particles("dot").createEmitter({
        speedX: -STAR_SPEED,
        scale: 0.05,
        lifespan: STAR_LIFESPAN,
        quantity: 0,
      }),
    ],
    startTimeMillis: undefined as number | undefined,
    welcomeScreen: [] as Phaser.GameObjects.Text[],
    scoreText: this.add
      .text(10, 5, highScoreText(), {
        fontSize: "90px",
        color: "black",
        // backgroundColor: "#5fe566",
      })
      .setDepth(1),
    scoreShadow: this.add
      .text(15, 10, highScoreText(), {
        fontSize: "90px",
        color: "white",
        // backgroundColor: "#5fe566",
      })
      .setDepth(-1),
    score: 0,
    colors: [
      { cutoff: 1000, color: 0x127475 }, // skobeloff (darkish teal)
      { cutoff: 1500, color: 0x562c2c }, // caput mortuum (reddish brown)
      { cutoff: 2000, color: 0x214e34 }, // british racing green

      { cutoff: 2500, color: 0x7d387d }, // maximum purple
      { cutoff: 3000, color: 0x153131 }, // rich black (dark teal)
      { cutoff: 3500, color: 0xa80874 }, // flirt (hot pink)
      { cutoff: 4000, color: 0x400588 }, // indigo
      { cutoff: 4500, color: 0x4d0505 }, // black bean (dark red)

      { cutoff: 5000, color: 0xf6f8ff }, // ghost white
      { cutoff: 5500, color: 0x9bdc9b }, // granny smith apple (light green)
      { cutoff: 6000, color: 0x5c0bdf }, // han purple
      { cutoff: 6500, color: 0xffeca7 }, // medium champagne (light yellow)
      { cutoff: 7000, color: 0x963d5a }, // quinacridone magenta (light reddish magenta)
      { cutoff: 7500, color: 0xffb800 }, // selective yellow
      { cutoff: 8000, color: 0xd6f6ca }, // tea green (very light green)
      { cutoff: 8500, color: 0x5eb1bf }, // maximum blue (light slate blue)
      { cutoff: 9000, color: 0xf06543 }, // orange soda
      { cutoff: 9500, color: 0xa2c2f3 }, // baby blue eyes

      { cutoff: 10000, color: 0x146aff }, // cb primary blue
      { cutoff: 12500, color: 0xe83f6f }, // paradise pink
      { cutoff: 15000, color: 0x9a348e }, // violet crayola
      { cutoff: 17500, color: 0x7785ac }, // shadow blue

      { cutoff: 20000, color: 0xee6055 }, // fire opal
      { cutoff: 25000, color: 0x279af1 }, // carolina blue

      { cutoff: 30000, color: 0x88292f }, // antique ruby
      { cutoff: 40000, color: 0x42113c }, // dark purple
      { cutoff: 50000, color: 0x85cbe9 }, // sky blue

      { cutoff: Infinity, color: 0xffffff },
    ].reverse(),
    currentColor: undefined as number | undefined,
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
    // globals.camera.setZoom(0.5);

    // this.add.image(WIDTH * 0.2, HEIGHT * 0.8, "wall"),

    this.fields = initFields.bind(this)();
    const $ = this.fields;

    $.welcomeScreen.push(
      this.add
        .text(WIDTH * 0.6, HEIGHT * 0.5, "CLICK TO START", {
          color: "white",
          fontSize: "100px",
        })
        .setOrigin(0.5, 0.5),
      this.add
        .text(WIDTH * 0.8, HEIGHT * 0.65, "CLICK AND HOLD TO GO UP", {
          color: "#cccccc",
          fontSize: "55px",
        })
        .setOrigin(1, 0.5),
      this.add
        .text(WIDTH * 0.8, HEIGHT * 0.69, "RELEASE TO GO DOWN", {
          color: "#cccccc",
          fontSize: "55px",
        })
        .setOrigin(1, 0.5),
      this.add
        .text(
          WIDTH * 0.8,
          HEIGHT * 0.76,
          "SPACEBAR OR TAP (MOBILE) WORKS TOO",
          {
            color: "#cccccc",
            fontSize: "55px",
          }
        )
        .setOrigin(1, 0.5)
    );

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

    this.addFirstCaveBlockPair();
    for (let i = 0; i < BLOCK_LIMIT; i++) {
      this.appendCaveBlockPair();
    }

    this.addFirstWall();
    this.appendWall();
    // this.appendWall();

    this.physics.add.overlap($.player, $.cave, this.onHit.bind(this));
    this.physics.add.overlap($.player, $.walls, this.onHit.bind(this));

    this.physics.pause();

    // this.start();
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
    const ceilingBlock = $.cave
      .create(x, ceiling, "tall-wall")
      .setOrigin(1, 1)
      // .setAlpha(segmentIndex % 2 === 0 ? 0.6 : 0.35)
      .setVelocityX(-HORIZONTAL_SPEED);

    const floorBlock = $.cave
      .create(x, floor, "tall-wall")
      .setOrigin(1, 0)
      // .setAlpha(segmentIndex % 2 === 0 ? 0.6 : 0.35)
      .setVelocityX(-HORIZONTAL_SPEED);

    if ($.currentColor) {
      ceilingBlock.setTint($.currentColor);
      floorBlock.setTint($.currentColor);
      ceilingBlock.tintFill = true;
      floorBlock.tintFill = true;
    }
  }

  appendWall() {
    // Walls shouldn't spawn fully inside the floor or ceiling (it's ok if
    // they have overlap -- even a lot of overlap -- but shouldn't be totally
    // hidden).
    //
    // Hack/caveat: Ideally, we look at the cave blocks that have the same x
    // value as the new wall -- but simpler is just to look at the last cave
    // blocks. This means that if cave blocks and walls spawn too far apart
    // from each other in the x dimension, this check becomes less reliable!
    // But they spawn pretty close to each other, so this should be fine.

    const $ = this.fields;
    const lastWall = $.walls.getLast(true);
    const [caveCeiling, caveFloor] = $.cave.children.entries.slice(-2);
    const x = lastWall.x + WIDTH * 0.75; //

    const y = randomInt(
      // @ts-ignore
      caveFloor.y, // The top of the floor
      // @ts-ignore
      caveCeiling.y // The bottom of the ceiling
    );

    // Since the newly-created wall is positioned by its center, it can have
    // a maximum overlap of half (with the hack caveat above)

    const newWall = $.walls
      .create(x, y, "wall")
      // .setAlpha(segmentIndex % 2 === 0 ? 0.6 : 0.35)
      .setVelocityX(-HORIZONTAL_SPEED);

    if ($.currentColor) {
      newWall.setTint($.currentColor);
      newWall.tintFill = true;
    }
  }

  start() {
    const $ = this.fields;
    if (!$.started) {
      $.started = true;
      $.startTimeMillis = new Date().valueOf();
      this.physics.resume();
      $.emitter.startFollow($.player, -120);

      $.welcomeScreen.forEach((text) => text.destroy());
    }
  }

  update() {
    const $ = this.fields;
    const globals = window as any;
    if ($.cursors.space.isDown || $.pointer.isDown || globals.isTouching) {
      this.start();
      // It feels kinda sudden to instantly stop accelerating at MAX_CLIMB_SPEED. Does the original game smooth that out?
      if (!$.isForcedDeath) {
        $.player.setVelocityY(
          Math.max($.player.body.velocity.y - LIFT, -MAX_CLIMB_SPEED)
        );
      }
    }
    const offset = 300;

    const removed = this.maybeRemoveCaveBlockPair();
    if (removed) {
      this.appendCaveBlockPair();
    }

    const removedWall = this.maybeRemoveWall();

    if (!$.stopped && $.startTimeMillis) {
      const score =
        ((new Date().valueOf() - $.startTimeMillis) / 1000) * POINTS_PER_SECOND;

      // tab-out detection -- maybe just use tabunload or whatever
      if ($.score && score - $.score > 50) {
        $.isForcedDeath = true;
      } else if (!$.isForcedDeath) {
        const scoreText = Math.floor(score).toString();
        $.scoreText.setText(scoreText);
        $.scoreShadow.setText(scoreText);

        $.score = score;
      }
    }

    if (removedWall) {
      this.maybeNextColor();
      this.appendWall();
    }

    if (
      STARS_ENABLED &&
      $.started &&
      !$.stopped &&
      Math.random() < this.starProbability($.score)
    ) {
      const emitter = randomChoice($.starEmitters);
      emitter.emitParticle(1, WIDTH, randomInt(0, HEIGHT));
    }
  }

  starProbability(score: number) {
    if (score < 250) {
      return 0.03;
    } else if (score < 500) {
      return 0.1;
    } else {
      return 0.2;
    }
  }

  onHit(
    player: PT.Physics.Arcade.GameObjectWithBody,
    wall: PT.Physics.Arcade.GameObjectWithBody
  ) {
    const $ = this.fields;
    const globals = window as any;
    if (!$.stopped) {
      $.stopped = true;
      this.physics.pause();
      $.player.setTint(0xff0000);
      $.emitter.pause();
      $.starEmitters.map((emitter) => emitter.pause());
      const bestScore = +(localStorage.getItem(HIGH_SCORE_KEY) || 0);
      const score = $.score;
      globals.onGameOver(Math.floor(score));
      if (score > bestScore) {
        localStorage.setItem(HIGH_SCORE_KEY, Math.floor(score).toString());
      }
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.scene.restart();
        },
      });
    }
  }

  maybeNextColor(): void {
    if (!COLORS_ENABLED) return;

    const $ = this.fields;
    const { cutoff, color } = $.colors.slice(-1)[0];
    if ($.score > cutoff) {
      $.colors.pop();
      $.currentColor = color;
    }
  }
}

function highScoreText() {
  const score = localStorage.getItem(HIGH_SCORE_KEY);
  if (score) {
    return `Best: ${score}`;
  } else {
    return "";
  }
}

// document.body.onkeydown = (event) => {
//   if (event.key === "'") {
//     const globals = window as any;
//     let $ = globals.scene.fields;
//     const color = $.colors.pop().color;
//     $.currentColor = color;
//   }
// }

document.body.addEventListener("touchstart", function (e) {
  const globals = window as any;
  globals.isTouching = true;
});

document.body.addEventListener("touchend", function (e) {
  const globals = window as any;
  globals.isTouching = false;
});
