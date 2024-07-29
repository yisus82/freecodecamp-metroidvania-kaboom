import { globalGameState } from '../state/globalGameState.js';
import { makeNotificationBox } from '../ui/notificationBox.js';

export const makeBoss = (k, position) => {
  const boss = k.make([
    k.pos(position.x, position.y),
    k.sprite('burner', { anim: 'idle' }),
    k.area({ shape: new k.Rect(k.vec2(0, 10), 12, 12) }),
    k.body({ mass: 100 }),
    k.anchor('center'),
    k.state('idle', ['idle', 'follow', 'open-fire', 'fire', 'shut-fire', 'defeated']),
    k.health(15),
    k.opacity(1),
    {
      pursuitSpeed: 100,
      fireRange: 40,
      fireDuration: 1,
    },
  ]);

  const player = k.get('player', { recursive: true })[0];

  boss.onStateUpdate('idle', () => {
    if (globalGameState.isPlayerInBossFight) {
      boss.enterState('follow');
    }
  });

  boss.onStateEnter('follow', () => {
    boss.play('run');
  });

  boss.onStateUpdate('follow', () => {
    boss.flipX = player.pos.x <= boss.pos.x;
    boss.moveTo(k.vec2(player.pos.x, player.pos.y + 12), boss.pursuitSpeed);
    if (boss.pos.dist(player.pos) < boss.fireRange) {
      boss.enterState('open-fire');
    }
  });

  boss.onStateEnter('open-fire', () => {
    boss.play('open-fire');
  });

  boss.onStateEnter('fire', () => {
    const flamethrowerSound = k.play('flamethrower');
    const fireHitbox = boss.add([
      k.area({ shape: new k.Rect(k.vec2(0), 70, 10) }),
      k.pos(boss.flipX ? -70 : 0, 5),
      'fire-hitbox',
    ]);

    fireHitbox.onCollide('player', () => {
      player.hurt(1);
      if (player.hp() <= 0) {
        globalGameState.isPlayerInBossFight = false;
        flamethrowerSound.stop();
        boss.enterState('shut-fire');
      }
    });

    k.wait(boss.fireDuration, () => {
      flamethrowerSound.stop();
      boss.enterState('shut-fire');
    });
  });

  boss.onStateEnd('fire', () => {
    const fireHitbox = k.get('fire-hitbox', { recursive: true })[0];
    if (fireHitbox) {
      k.destroy(fireHitbox);
    }
  });

  boss.onStateUpdate('fire', () => {
    if (boss.curAnim() !== 'fire') {
      boss.play('fire');
    }
  });

  boss.onStateEnter('shut-fire', () => {
    boss.play('shut-fire');
  });

  boss.onAnimEnd(anim => {
    switch (anim) {
      case 'open-fire':
        boss.enterState('fire');
        break;
      case 'shut-fire':
        boss.enterState('follow');
        break;
      case 'explode':
        k.destroy(boss);
        break;
    }
  });

  boss.onCollide('sword-hitbox', () => {
    boss.hurt(1);
  });

  boss.on('hurt', async () => {
    if (boss.hp() <= 0) {
      globalGameState.isBossDefeated = true;
      boss.enterState('defeated');
      boss.collisionIgnore = ['player', 'sword-hitbox'];
      boss.unuse('body');
      k.play('boom');
      boss.play('explode');
      globalGameState.isDoubleJumpUnlocked = true;
      player.numJumps = 2;
      k.play('notify');
      const notification = k.add(
        makeNotificationBox(k, 'You unlocked a new ability!\nYou can now double jump.')
      );
      k.wait(3, () => notification.close());
    } else {
      for (let i = 0; i < 2; i++) {
        await k.tween(boss.opacity, 0, 0.1, val => (boss.opacity = val), k.easings.linear);
        await k.wait(0.1);
        await k.tween(boss.opacity, 1, 0.1, val => (boss.opacity = val), k.easings.linear);
        await k.wait(0.1);
      }
    }
  });

  return boss;
};
