export const setBackgroundColor = (k, color) => {
  k.add([k.rect(k.width(), k.height()), k.color(k.Color.fromHex(color)), k.fixed()]);
};
