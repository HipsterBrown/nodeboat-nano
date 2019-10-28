const five = require('johnny-five');
const keypress = require('keypress');

const board = new five.Board({
  port: '/dev/tty.blobfish-DevB',
});

board.on('error', error => {
  console.error(error);
  process.exit(1);
});

board.on('ready', () => {
  let speed = 50;
  const led = new five.Led(13);
  const esc = new five.ESC({
    device: 'FORWARD_REVERSE',
    neutral: speed,
    pin: 11,
  });
  const servo = new five.Servo(10);
  servo.center();

  // just to make sure the program is running
  led.blink(500);

  function controller(_, key) {
    let isThrottle = false;

    if (key && key.shift) {
      if (key.name === 'up' && speed <= 100) {
        speed += 1;
        isThrottle = true;
      }

      if (key.name === 'down' && speed >= 0) {
        speed -= 1;
        isThrottle = true;
      }

      if (key.name === 'left') {
        servo.to(45, 1000);
      }

      if (key.name === 'right') {
        servo.to(135, 1000);
      }

      if (key.name === 'c') {
        servo.center();
      }

      if (isThrottle) {
        console.log('Setting speed: ', speed);

        esc.throttle(
          five.Fn.scale(speed, 0, 100, esc.pwmRange[0], esc.pwmRange[1]),
        );

        // esc.speed(speed);
      }
    }
  }

  keypress(process.stdin);

  process.stdin.on('keypress', controller);
  process.stdin.setRawMode(true);
  process.stdin.resume();
});
