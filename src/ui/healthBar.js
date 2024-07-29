import { globalGameState } from '../state/globalGameState.js';

export const makeHealthBar = k => {
  const healthBar = k.make([
    k.pos(10, 10),
    k.sprite('healthBar', { frame: globalGameState.maxPlayerHP - globalGameState.playerHP }),
    k.fixed(),
    k.scale(4),
  ]);

  healthBar.on('update', () => {
    if (globalGameState.playerHP <= 0) {
      k.destroy(healthBar);
      return;
    }
    healthBar.frame = globalGameState.maxPlayerHP - globalGameState.playerHP;
  });

  return healthBar;
};
