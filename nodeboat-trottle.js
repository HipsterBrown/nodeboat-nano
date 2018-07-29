const five = require('johnny-five');

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

  const throttle = new five.Sensor('A0');
  throttle.on('change', function() {
    const speed = throttle.scaleTo(0, 100);
    console.log('Throttle speed', speed);
    if (esc.value !== speed) {
      esc.speed(speed);
    }
  });
});
