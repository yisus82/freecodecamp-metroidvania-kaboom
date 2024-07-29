import room1 from './scenes/room1.js';
import room2 from './scenes/room2.js';
import { setBackgroundColor } from './scenes/roomUtils.js';
import { makeNotificationBox } from './ui/notificationBox.js';

const gameSetup = async () => {
  const body = document.querySelector('body');
  body.innerHTML = '';

  const k = await import('./kaboomLoader.js')
    .then(module => module.default)
    .catch(console.error);

  const room1Data = await fetch('./assets/maps/room1.json')
    .then(res => res.json())
    .catch(console.error);
  k.scene('room1', previousSceneData => {
    room1(k, room1Data, previousSceneData);
  });

  const room2Data = await fetch('./assets/maps/room2.json')
    .then(res => res.json())
    .catch(console.error);
  k.scene('room2', previousSceneData => {
    room2(k, room2Data, previousSceneData);
  });

  k.scene('final-exit', () => {
    setBackgroundColor(k, '#20214A');
    k.add(
      makeNotificationBox(k, 'Congratulations!!!\nYou escaped the factory!\nThanks for playing!')
    );
  });

  k.audioCtx.resume();
  k.go('room1');
};

const startButton = document.getElementById('start');
startButton.addEventListener('click', gameSetup);
