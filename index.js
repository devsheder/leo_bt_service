// rouge 5V, marron masse et orange commande, BCM 17 (pin 11)
var Cylon = require("cylon");
// forward = 66006f0072007700610072006400, backward = 6200610063006b007700610072006400, left = 6c00650066007400, right = 72006900670068007400, stop = "730074006f007000"
var availableInstructions = ["66006f0072007700610072006400", "6200610063006b007700610072006400", "6c00650066007400", "72006900670068007400", "730074006f007000"];

var isLeoMoving = false;

function move(instruction) {
	if (availableInstructions.indexOf(instruction) >= 0) {
		var leoMovement = {
			isStart:false,
			direction:"000000"
		};	
		if (instruction === "66006f0072007700610072006400") {
			// forward
			leoMovement.isStart=true;
			leoMovement.direction="ff0022";
			console.log("Leo is moving forward !");
		} else if (instruction === "6200610063006b007700610072006400") {
			// backward
			leoMovement.isStart=true;
			leoMovement.direction="ff2200";
			console.log("Leo is moving backward !");
		} else if (instruction === "6c00650066007400") {
			// left
		} else if (instruction === "72006900670068007400") {
			// right
		} else if (instruction === "730074006f007000"){
			console.log("Leo is stopping !");
		}

		Cylon.robot({
			connections: {
				raspi: { adaptor: 'raspi' }
			},
			
			devices: {
				leds: { driver: 'rgb-led', redPin: 11, greenPin: 13, bluePin: 15},
				led: { driver: 'led', pin: 11}
			},
			
			work: function(my) {
				if (leoMovement.isStart) {
					if (!isLeoMoving) {
						my.led.turnOn();
					}
					my.leds.setRGB("000000");
					my.leds.setRGB(leoMovement.direction);
					isLeoMoving = true;
				} else {
					if (isLeoMoving) {
						my.led.turnOff();
					}
					my.leds.setRGB("000000");
					isLeoMoving = false;
				}
			}
		}).start();

	}
	console.log("---");
}


var bleno = require("bleno");
var BlenoPrimaryService = bleno.PrimaryService;
var Characteristic = bleno.Characteristic;
var uuidHWService = "fffffffffffffffffffffffffffffff0";

bleno.on('stateChange', function(state) {
	console.log(state);
	if (state === 'poweredOn') {
		bleno.startAdvertising("helloworld", [uuidHWService]);
	} else {
		bleno.stopAdvertising();
	}
});

bleno.on('advertisingStart', function(error) {
	console.log(error ? "error" + error : "success");
	
	if (!error) {
		bleno.setServices([
			new BlenoPrimaryService({
				uuid:uuidHWService,
				characteristics: [
					new Characteristic({
						uuid:uuidHWService,
						properties:["read", "write"],
						value:null,
						onReadRequest:function(offset, callback) {
							callback(this.RESULT_SUCCESS, new Buffer("Hello world!"));
						},
						onWriteRequest:function(data, offset, withoutResponse, callback) {
							move(data.toString("hex"));
							callback(this.RESULT_SUCCESS);
						},
					})
				]
			})
		]);
	}
});

bleno.on('advertisingStop', function(error) {
	console.log(error ? "error" + error : "success");
});