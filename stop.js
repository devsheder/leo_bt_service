// rouge 5V, marron masse et orange commande, BCM 17 (pin 11)
var Cylon = require("cylon");

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
    led: { driver: 'led', pin: 11}
  },

  work: function(my) {
    my.led.turnOff(function(err,val){
        console.log(val);
    });
  }
}).start();

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
    led: { driver: 'led', pin: 13}
  },

  work: function(my) {
    my.led.turnOff(function(err,val){
        console.log(val);
    });
  }
}).start();

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
    led: { driver: 'led', pin: 15}
  },

  work: function(my) {
    my.led.turnOff(function(err,val){
        console.log(val);
    });
  }
}).start();