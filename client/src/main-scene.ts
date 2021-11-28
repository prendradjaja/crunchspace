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
    pointer: this.game.input.mousePointer,
    caveShapeGenerator: makeCaveShapeGenerator(),
    started: false,
    stopped: false,
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
    scoreText: this.add
      .text(0, 0, highScoreText(), {
        fontSize: "90px",
        color: "black",
        // backgroundColor: "#5fe566",
      })
      .setDepth(1),
    score: 0,
    colors: [
      { cutoff: 1000, color: 0x127475 }, // skobeloff (darkish teal)
      { cutoff: 1250, color: 0x562c2c }, // caput mortuum (reddish brown)
      { cutoff: 1500, color: 0x214e34 }, // british racing green

      // TODO purple instead of teal?
      { cutoff: 1750, color: 0x153131 }, // rich black (dark teal)

      // TODO prob something else if above is purple
      { cutoff: 2000, color: 0x7e7f9a }, // rhythm (light bluish gray)
      // { cutoff: , color: 0x404E4D }, // dark slate gray
      // { cutoff: , color: 0x823200 }, // saddle brown
      // { cutoff: , color: 0xAE8E1C }, // dark goldenrod

      { cutoff: Infinity, color: 0xffffff },

      // 0x370926, // dark purple (wine) -- TOO DARK
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
    }
  }

  update() {
    const $ = this.fields;
    if ($.cursors.space.isDown || $.pointer.isDown) {
      this.start();
      // It feels kinda sudden to instantly stop accelerating at MAX_CLIMB_SPEED. Does the original game smooth that out?
      $.player.setVelocityY(
        Math.max($.player.body.velocity.y - LIFT, -MAX_CLIMB_SPEED)
      );
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

      $.scoreText.setText(score.toFixed(0).toString());
      $.score = score;
    }

    if (removedWall) {
      this.maybeNextColor();
      this.appendWall();
    }

    if (STARS_ENABLED && $.started && !$.stopped && Math.random() < 0.2) {
      const emitter = randomChoice($.starEmitters);
      emitter.emitParticle(1, WIDTH, randomInt(0, HEIGHT));
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
        localStorage.setItem(HIGH_SCORE_KEY, $.score.toFixed(0));
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
