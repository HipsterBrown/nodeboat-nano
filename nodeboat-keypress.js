const five = require('johnny-five');
const keypress = require('keypress');

const board = new five.Board({
  port: '/dev/tty.Nodeboat-SPPDev',
});

board.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

board.on('ready', () => {
  const led = new five.Led(13);
  const esc = new five.ESC({
    device: 'FORWARD_REVERSE',
    neutral: 50,
    pin: 11,
  });

  led.blink(500);

  function controller (_, key) {
    let isThrottle = false;
    let speed = esc.last ? esc.value : 50;

    if (key && key.shift) {

      if (key.name === 'c') {
        process.exit(0);
        return;
      }

      if (key.name === 'up' && speed <= 100) {
        speed += 1;
        isThrottle = true;
      }

      if (key.name === 'down' && speed >= 0) {
        speed -= 1;
        isThrottle = true;
      }

      if (isThrottle) {
        console.log('Setting speed: ', speed);
        esc.speed(speed);
      }
    }
  }

  keypress(process.stdin);

  process.stdin.on('keypress', controller);
  process.stdin.setRawMode(true);
  process.stdin.resume();
});
