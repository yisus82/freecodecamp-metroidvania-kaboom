import { makePlayer } from '../entities/player.js';
import { globalGameState } from '../state/globalGameState.js';
import { setBackgroundColor, setColliders } from './roomUtils.js';

const room1 = (k, roomData) => {
  globalGameState.currentScene = 'room1';
  setBackgroundColor(k, '#A2AED5');
  const map = k.add([k.sprite('room1')]);

  const layerObjects = roomData.layers.reduce((layerObjects, layer) => {
    if (layer.type === 'objectgroup') {
      layerObjects[layer.name] = layer.objects;
    }
    return layerObjects;
  }, {});
  setColliders(k, map, layerObjects.colliders);

  const playerPosition = layerObjects.positions.find(position => position.name === 'player');
  const player = makePlayer(k, playerPosition);
  map.add(player);
  k.camScale(4);
  k.camPos(player.pos);
  k.setGravity(1000);
};

export default room1;
