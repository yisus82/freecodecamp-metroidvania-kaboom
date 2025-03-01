import kaboom from '../lib/kaboom/kaboom.mjs';

const k = kaboom({
  width: 640 * 2,
  height: 360 * 2,
  scale: 2,
  letterbox: true,
  global: false,
});

k.loadFont('glyphmesss', './assets/fonts/glyphmesss.ttf');

k.loadSprite('player', './assets/images/u.png', {
  sliceX: 8,
  sliceY: 9,
  anims: {
    idle: { from: 0, to: 7, loop: true },
    run: { from: 8, to: 13, loop: true },
    jump: 51,
    fall: 54,
    explode: { from: 64, to: 69 },
    attack: { from: 24, to: 28, speed: 16 },
  },
});

k.loadSprite('drone', './assets/images/dr0ne.png', {
  sliceX: 6,
  sliceY: 3,
  anims: {
    flying: { from: 0, to: 3, loop: true },
    attack: { from: 6, to: 11, loop: true },
    explode: { from: 12, to: 17 },
  },
});

k.loadSprite('burner', './assets/images/burn3r.png', {
  sliceX: 5,
  sliceY: 6,
  anims: {
    idle: { from: 0, to: 3, loop: true },
    run: { from: 6, to: 8, loop: true },
    'open-fire': { from: 10, to: 14 },
    fire: { from: 15, to: 18, loop: true },
    'shut-fire': { from: 20, to: 23 },
    explode: { from: 25, to: 29 },
  },
});

k.loadSpriteAtlas('./assets/images/ui.png', {
  healthBar: {
    x: 16,
    y: 16,
    width: 60,
    height: 48,
    sliceY: 3,
  },
});

k.loadSpriteAtlas('./assets/images/animations.png', {
  cartridge: {
    x: 125,
    y: 145,
    width: 134,
    height: 16,
    sliceX: 8,
    anims: {
      default: { from: 0, to: 4, loop: true, speed: 7 },
    },
  },
});

k.loadSprite('tileset', './assets/images/tileset.png', {
  sliceX: 33,
  sliceY: 21,
});

k.loadSprite('background', './assets/images/background.png', {
  sliceX: 13,
  sliceY: 25,
});

k.loadSound('boom', './assets/sounds/boom.wav');
k.loadSound('flamethrower', './assets/sounds/flamethrower.mp3');
k.loadSound('health', './assets/sounds/health.wav');
k.loadSound('notify', './assets/sounds/notify.mp3');
k.loadSound('sword', './assets/sounds/sword.wav');

k.loadSprite('room1', './assets/maps/room1.png');
k.loadSprite('room2', './assets/maps/room2.png');

export default k;
