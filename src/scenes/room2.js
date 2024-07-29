import { makePlayer } from '../entities/player.js';
import { globalGameState } from '../state/globalGameState.js';
import { makeHealthBar } from '../ui/healthBar.js';
import {
  setBackgroundColor,
  setCamera,
  setCameraZones,
  setCartridges,
  setColliders,
  setDrones,
  setExitZones,
} from './roomUtils.js';

const room1 = (k, roomData, previousSceneData = { exitName: null }) => {
  globalGameState.currentScene = 'room2';
  globalGameState.exitName = previousSceneData.exitName;
  setBackgroundColor(k, '#A2AED5');
  const map = k.add([k.pos(), k.sprite('room2')]);

  const layerObjects = roomData.layers.reduce((layerObjects, layer) => {
    if (layer.type === 'objectgroup') {
      layerObjects[layer.name] = layer.objects;
    }
    return layerObjects;
  }, {});
  setColliders(k, map, layerObjects.colliders);

  const healthBar = makeHealthBar(k);
  map.add(healthBar);

  let playerPosition;
  if (previousSceneData.exitName === 'exit-1') {
    playerPosition = layerObjects.positions.find(position => position.name === 'entrance-1');
  } else if (previousSceneData.exitName === 'exit-2') {
    playerPosition = layerObjects.positions.find(position => position.name === 'entrance-2');
  }
  const player = makePlayer(k, playerPosition, healthBar);
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

  setExitZones(k, map, layerObjects.exits, 'room1');
};

export default room1;
