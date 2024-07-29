import { globalGameState } from '../state/globalGameState.js';

export const makePlayer = (k, position, healthBar) => {
  const player = k.make([
    k.pos(position.x, position.y),
    k.sprite('player'),
    k.area({
      shape: new k.Rect(k.vec2(0, 18), 12, 12),
    }),
    k.anchor('center'),
    k.body({ mass: 100, jumpForce: 320 }),
    k.doubleJump(globalGameState.isDoubleJumpUnlocked ? 2 : 1),
    k.opacity(1),
    k.health(globalGameState.playerHP, globalGameState.maxPlayerHP),
    'player',
    {
      speed: 150,
      isAttacking: false,
      isFrozen: false,
    },
  ]);

  player.onAnimEnd(anim => {
    if (anim === 'attack') {
      const swordHitbox = k.get('sword-hitbox', { recursive: true })[0];
      if (swordHitbox) {
        k.destroy(swordHitbox);
      }
      player.isAttacking = false;
      player.play('idle');
      return;
    }

    if (anim === 'explode') {
      globalGameState.playerHP = globalGameState.maxPlayerHP;
      k.go('room1');
    }
  });

  player.onBeforePhysicsResolve(collision => {
    if (collision.target.is('passthrough') && player.isJumping()) {
      collision.preventResolution();
    }
  });

  player.onFall(() => {
    player.play('fall');
  });

  player.onFallOff(() => {
    player.play('fall');
  });

  player.onGround(() => {
    player.play('idle');
  });

  player.onHeadbutt(() => {
    player.play('fall');
  });

  player.onUpdate(() => {
    if (player.pos.y > 1000) {
      k.go(globalGameState.currentScene);
    } else if (player.pos.y < 0) {
      player.pos.y = 0;
    }
  });

  player.on('heal', () => {
    globalGameState.playerHP = player.hp();
    healthBar.trigger('update');
  });

  player.on('hurt', async () => {
    if (player.hp() <= 0) {
      k.play('boom');
      player.play('explode');
    } else {
      globalGameState.playerHP = player.hp();
      healthBar.trigger('update');
      for (let i = 0; i < 2; i++) {
        await k.tween(player.opacity, 0, 0.1, val => (player.opacity = val), k.easings.linear);
        await k.wait(0.1);
        await k.tween(player.opacity, 1, 0.1, val => (player.opacity = val), k.easings.linear);
        await k.wait(0.1);
      }
    }
  });

  k.onKeyPress(key => {
    if (player.isFrozen) {
      return;
    }

    if (key === 'up' || key === 'w') {
      if (player.curAnim() !== 'jump') {
        player.play('jump');
      }
      player.doubleJump();
      return;
    }

    if (key === 'space' && player.curAnim() !== 'attack' && player.isGrounded()) {
      player.isAttacking = true;
      player.add([
        k.pos(player.flipX ? -25 : 0, 10),
        k.area({ shape: new k.Rect(k.vec2(0), 25, 10) }),
        'sword-hitbox',
      ]);
      player.play('attack');
      k.play('sword');
      return;
    }
  });

  k.onKeyDown(key => {
    if (player.isFrozen) {
      return;
    }

    if ((key === 'left' || key === 'a') && !player.isAttacking) {
      if (player.curAnim() !== 'run' && player.isGrounded()) {
        player.play('run');
      }
      player.flipX = true;
      player.move(-player.speed, 0);
      return;
    }

    if ((key === 'right' || key === 'd') && !player.isAttacking) {
      if (player.curAnim() !== 'run' && player.isGrounded()) {
        player.play('run');
      }
      player.flipX = false;
      player.move(player.speed, 0);
      return;
    }
  });

  k.onKeyRelease(() => {
    if (player.curAnim() === 'run') {
      player.play('idle');
    }
  });

  return player;
};
