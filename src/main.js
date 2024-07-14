import { k } from './kaboomLoader.js';
import room1 from './scenes/room1.js';
import room2 from './scenes/room2.js';

k.scene('room1', () => {
  room1();
});

k.scene('room2', () => {
  room2();
});

k.scene('intro', () => {});

k.go('intro');
