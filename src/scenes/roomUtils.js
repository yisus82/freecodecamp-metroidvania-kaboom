import { makeCartridge } from '../entities/cartridge.js';
import { makeDrone } from '../entities/drone.js';
import { globalGameState } from '../state/globalGameState.js';

export const setBackgroundColor = (k, color) => {
  k.add([k.rect(k.width(), k.height()), k.color(k.Color.fromHex(color)), k.fixed()]);
};

export const setColliders = (k, map, colliders) => {
  for (const collider of colliders) {
    if (collider.name === 'boss-barrier') {
      const bossBarrier = map.add([
        k.rect(collider.width, collider.height),
        k.color(k.Color.fromHex('#eacfba')),
        k.pos(collider.x, collider.y),
        k.area({
          collisionIgnore: ['collider'],
        }),
        k.opacity(0),
        'boss-barrier',
        {
          async activate() {
            k.tween(this.opacity, 0.3, 1, val => (this.opacity = val), k.easings.linear);
            await k.tween(
              k.camPos().x,
              collider.properties[0].value,
              1,
              val => k.camPos(val, k.camPos().y),
              k.easings.linear
            );
          },
          async deactivate(playerPosX) {
            k.tween(this.opacity, 0, 1, val => (this.opacity = val), k.easings.linear);
            await k.tween(
              k.camPos().x,
              playerPosX,
              1,
              val => k.camPos(val, k.camPos().y),
              k.easings.linear
            );
            k.destroy(this);
          },
        },
      ]);

      bossBarrier.onCollide('player', async player => {
        if (globalGameState.isBossDefeated) {
          await bossBarrier.deactivate(player.pos.x);
          globalGameState.isPlayerInBossFight = false;
          return;
        }

        if (globalGameState.isPlayerInBossFight) {
          return;
        }

        player.isFrozen = true;
        player.play('idle');
        await k.tween(
          player.pos.x,
          player.pos.x + 25,
          0.2,
          val => (player.pos.x = val),
          k.easings.linear
        );
        await bossBarrier.activate();
        bossBarrier.use(k.body({ isStatic: true }));
        globalGameState.isPlayerInBossFight = true;
        player.isFrozen = false;
      });

      continue;
    }

    let colliderShape;
    if (collider.polygon) {
      colliderShape = new k.Polygon(collider.polygon.map(point => k.vec2(point.x, point.y)));
    } else {
      colliderShape = new k.Rect(k.vec2(0), collider.width, collider.height);
    }

    map.add([
      k.pos(collider.x, collider.y),
      k.area({
        shape: colliderShape,
        collisionIgnore: ['collider'],
      }),
      k.body({ isStatic: true }),
      'collider',
      collider.type,
    ]);
  }
};

export const setCamera = (k, player, map, roomData) => {
  k.camScale(4);
  k.camPos(player.pos.x, player.pos.y);
  k.onUpdate(() => {
    if (globalGameState.isPlayerInBossFight) {
      return;
    }

    const minX = map.pos.x + 160;
    const maxX = map.pos.x + roomData.width * roomData.tilewidth - 160;
    k.camPos(Math.max(minX, Math.min(player.pos.x, maxX)), k.camPos().y);
  });
};

export const setCameraZones = (k, map, cameras) => {
  for (const camera of cameras) {
    const cameraZone = map.add([
      k.pos(camera.x, camera.y),
      k.area({
        shape: new k.Rect(k.vec2(0), camera.width, camera.height),
        collisionIgnore: ['collider'],
      }),
      'camera-zone',
    ]);

    cameraZone.onCollide('player', () => {
      const camPosY = camera.properties.find(property => property.name === 'camPosY').value;
      if (k.camPos().y !== camPosY) {
        k.tween(k.camPos().y, camPosY, 0.8, val => k.camPos(k.camPos().x, val), k.easings.linear);
      }
    });
  }
};

export const setDrones = (k, map, drones) => {
  for (const drone of drones) {
    map.add(makeDrone(k, k.vec2(drone.x, drone.y)));
  }
};

export const setCartridges = (k, map, cartridges) => {
  for (const cartridge of cartridges) {
    map.add(makeCartridge(k, k.vec2(cartridge.x, cartridge.y)));
  }
};
