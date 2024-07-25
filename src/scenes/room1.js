import { setBackgroundColor, setColliders } from './roomUtils.js';

const room1 = (k, roomData) => {
  setBackgroundColor(k, '#A2AED5');
  const map = k.add([k.sprite('room1')]);

  const layerObjects = roomData.layers.reduce((layerObjects, layer) => {
    if (layer.type === 'objectgroup') {
      layerObjects[layer.name] = layer.objects;
    }
    return layerObjects;
  }, {});
  setColliders(k, map, layerObjects.colliders);

  k.camScale(4);
  k.camPos(170, 100);
};

export default room1;
