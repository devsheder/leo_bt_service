// rouge 5V, marron masse et orange commande, BCM 17 (pin 11)
var Cylon = require("cylon");
// forward = 66006f0072007700610072006400, backward = 6200610063006b007700610072006400, left = 6c00650066007400, right = 72006900670068007400
var availableInstructions = ["66006f0072007700610072006400", "6200610063006b007700610072006400", "6c00650066007400", "72006900670068007400"];

function move(instruction) {
	if (availableInstructions.indexOf(instruction) >= 0) {
		console.log("Leo is moving !");

		var angle = 0;
		if (instruction === "66006f0072007700610072006400") {
			angle = 10;
		} else if (instruction === "6200610063006b007700610072006400") {
			angle = 20;
		} else if (instruction === "6c00650066007400") {
			angle = 30;
		} else if (instruction === "72006900670068007400") {
			angle = 40;
		}

		Cylon.robot({
			connections: {
				raspi : {adaptor : "raspi"}
			},
			devices: {
				servo : {driver : "servo", pin : 11}
			},
			work: function(my) {
				my.servo.angle(angle);
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