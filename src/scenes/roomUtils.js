export const setBackgroundColor = (k, color) => {
  k.add([k.rect(k.width(), k.height()), k.color(k.Color.fromHex(color)), k.fixed()]);
};

export const setColliders = (k, map, colliders) => {
  for (const collider of colliders) {
    if (collider.name === 'boss-barrier') {
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
