import { k } from './kaboomLoader.js';
import room1 from './scenes/room1.js';
import room2 from './scenes/room2.js';

const gameSetup = async () => {
  const room1Data = await fetch('./assets/maps/room1.json')
    .then(res => res.json())
    .catch(console.error);
  k.scene('room1', () => {
    room1(k, room1Data);
  });

  k.scene('room2', () => {
    room2();
  });

  k.scene('intro', () => {
    k.onKeyPress('enter', () => {
      k.go('room1');
    });
  });

  k.go('intro');
};

gameSetup();
