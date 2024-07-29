import room1 from './scenes/room1.js';
import room2 from './scenes/room2.js';

const gameSetup = async () => {
  const body = document.querySelector('body');
  body.innerHTML = '';

  const k = await import('./kaboomLoader.js')
    .then(module => module.default)
    .catch(console.error);

  const room1Data = await fetch('./assets/maps/room1.json')
    .then(res => res.json())
    .catch(console.error);
  k.scene('room1', () => {
    room1(k, room1Data);
  });

  k.scene('room2', () => {
    room2();
  });

  k.audioCtx.resume();
  k.go('room1');
};

const startButton = document.getElementById('start');
startButton.addEventListener('click', gameSetup);
