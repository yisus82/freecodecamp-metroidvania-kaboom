import { makeBoss } from '../entities/boss.js';
import { makePlayer } from '../entities/player.js';
import { globalGameState } from '../state/globalGameState.js';
import {
  setBackgroundColor,
  setCamera,
  setCameraZones,
  setCartridges,
  setColliders,
  setDrones,
} from './roomUtils.js';

const room1 = (k, roomData) => {
  globalGameState.currentScene = 'room1';
  setBackgroundColor(k, '#A2AED5');
  const map = k.add([k.pos(), k.sprite('room1')]);

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
  k.setGravity(1000);

  setCamera(k, player, map, roomData);
  setCameraZones(k, map, layerObjects.cameras);

  setDrones(
    k,
    map,
    layerObjects.positions.filter(position => position.type === 'drone')
  );

  setCartridges(
    k,
    map,
    layerObjects.positions.filter(position => position.type === 'cartridge')
  );

  if (!globalGameState.isBossDefeated) {
    const bossPosition = layerObjects.positions.find(position => position.name === 'boss');
    const boss = makeBoss(k, bossPosition);
    map.add(boss);
  }
};

export default room1;
