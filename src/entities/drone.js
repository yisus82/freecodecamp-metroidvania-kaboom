export const makeDrone = (k, position) => {
  const drone = k.make([
    k.pos(position),
    k.sprite('drone', { anim: 'flying' }),
    k.area({ shape: new k.Rect(k.vec2(0), 12, 12) }),
    k.anchor('center'),
    k.body({ gravityScale: 0 }),
    k.state('patrol-right', ['patrol-right', 'patrol-left', 'alert', 'pursuit', 'retreat']),
    k.health(1),
    'drone',
    {
      speed: 100,
      pursuitSpeed: 150,
      range: 100,
    },
  ]);

  const player = k.get('player', { recursive: true })[0];

  drone.onStateEnter('patrol-right', async () => {
    await k.wait(3);
    if (drone.state === 'patrol-right') {
      drone.enterState('patrol-left');
    }
  });

  drone.onStateUpdate('patrol-right', () => {
    if (drone.pos.dist(player.pos) < drone.range) {
      drone.enterState('alert');
      return;
    }
    drone.flipX = false;
    drone.move(drone.speed, 0);
  });

  drone.onStateEnter('patrol-left', async () => {
    await k.wait(3);
    if (drone.state === 'patrol-left') {
      drone.enterState('patrol-right');
    }
  });

  drone.onStateUpdate('patrol-left', () => {
    if (drone.pos.dist(player.pos) < drone.range) {
      drone.enterState('alert');
      return;
    }
    drone.flipX = true;
    drone.move(-drone.speed, 0);
  });

  drone.onStateEnter('alert', async () => {
    await k.wait(1);
    if (drone.pos.dist(player.pos) < drone.range) {
      drone.enterState('pursuit');
      return;
    }
    drone.enterState('retreat');
  });

  drone.onStateUpdate('pursuit', () => {
    if (drone.pos.dist(player.pos) > drone.range) {
      drone.enterState('alert');
      return;
    }
    drone.flipX = player.pos.x <= drone.pos.x;
    drone.moveTo(k.vec2(player.pos.x, player.pos.y + 12), drone.pursuitSpeed);
  });

  drone.onStateUpdate('retreat', () => {
    if (drone.pos.dist(player.pos) < drone.range) {
      drone.enterState('alert');
      return;
    }
    drone.flipX = position.x <= drone.pos.x;
    drone.moveTo(k.vec2(position.x, position.y), drone.speed);
    if (drone.pos.dist(position) < 1) {
      drone.enterState('patrol-right');
    }
  });

  drone.onAnimEnd(anim => {
    if (anim === 'explode') {
      k.destroy(drone);
    }
  });

  drone.onCollide('player', () => {
    drone.hurt(1);
    player.hurt(1);
  });

  drone.onCollide('sword-hitbox', () => {
    drone.hurt(1);
  });

  drone.on('hurt', () => {
    if (drone.hp() <= 0) {
      drone.collisionIgnore = ['player'];
      drone.unuse('body');
      k.play('boom');
      drone.play('explode');
    }
  });

  return drone;
};
