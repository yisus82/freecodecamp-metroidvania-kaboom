import { setBackgroundColor } from './roomUtils.js';

const room1 = (k, roomData) => {
  setBackgroundColor(k, '#A2AED5');
  const map = k.add([k.sprite('room1')]);
};

export default room1;
