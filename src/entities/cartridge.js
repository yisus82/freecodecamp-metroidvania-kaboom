import { globalGameState } from '../state/globalGameState.js';

export const makeCartridge = (k, position) => {
  const cartridge = k.make([
    k.pos(position.x, position.y),
    k.sprite('cartridge', { anim: 'default' }),
    k.area(),
    k.anchor('center'),
  ]);

  cartridge.onCollide('player', player => {
    if (player.hp() < globalGameState.maxPlayerHP) {
      k.play('health', { volume: 0.5 });
      player.heal(1);
      k.destroy(cartridge);
    }
  });

  return cartridge;
};
