// rouge 5V, marron masse et orange commande, BCM 17 (pin 11)
var Cylon = require("cylon");

Cylon.robot({
	connections: {
		raspi: { adaptor: 'raspi' }
	},
	
	devices: {
		leds: { driver: 'rgb-led', redPin: 11, greenPin: 13, bluePin: 15},
		led: { driver: 'led', pin: 11}
	},
	
	work: function(my) {
		
		every((1).second(), function() {
			// my.leds.setRGB("ff00ff");
			my.led.turnOn();
		});
	}
}).start();

Cylon.robot({
	connections: {
		raspi: { adaptor: 'raspi' }
	},
	
	devices: {
		leds: { driver: 'rgb-led', redPin: 11, greenPin: 13, bluePin: 15},
		led: { driver: 'led', pin: 13}
	},
	
	work: function(my) {
		my.led.turnOn();
		every((1).second(), function() {
			//my.leds.setRGB("ff00ff");
			my.led.turnOff();
		});
	}
}).start();

Cylon.robot({
	connections: {
		raspi: { adaptor: 'raspi' }
	},
	
	devices: {
		leds: { driver: 'rgb-led', redPin: 11, greenPin: 13, bluePin: 15},
		led: { driver: 'led', pin: 15}
	},
	
	work: function(my) {
		my.led.turnOn();
		every((1).second(), function() {
			//my.leds.setRGB("ff00ff");
			my.led.turnOn();
		});
	}
}).start();