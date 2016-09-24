// rouge 5V, marron masse et orange commande, BCM 17 (pin 11)
var Cylon = require("cylon");

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
	led1: { driver: 'led', pin: 11},
	led2: { driver: 'led', pin: 13},
	led3: { driver: 'led', pin: 15},
	led4: { driver: 'led', pin: 12},
	led5: { driver: 'led', pin: 16},
	led6: { driver: 'led', pin: 18}
  },

  work: function(my) {
    my.led1.turnOff();
    my.led4.turnOff();
    my.led2.turnOn();
    my.led3.turnOn();
    my.led5.turnOn();
    my.led6.turnOn();
  }
}).start();