// rouge 5V, marron masse et orange commande, BCM 17 (pin 11)
var Cylon = require("cylon");
// forward = 66006f0072007700610072006400, backward = 6200610063006b007700610072006400, left = 6c00650066007400, right = 72006900670068007400, stop = "730074006f007000"
var availableInstructions = ["66006f0072007700610072006400", "6200610063006b007700610072006400", "6c00650066007400", "72006900670068007400", "730074006f007000"];

var isLeoMoving = false;

function move(instruction) {
	if (availableInstructions.indexOf(instruction) >= 0) {
		// Paramètre des mouvements du robot
		// 0 -> arrêt, 1 -> forward, -1-> backward
		var leoMovementParams = {
			mustMove:false,
			leftWheel:0,
			rigthWheel:0
		};	
		if (instruction === "66006f0072007700610072006400") {
			// forward
			leoMovementParams.mustMove=true;
			leoMovementParams.leftWheel=1;
			leoMovementParams.rigthWheel=1;
			console.log("Leo is moving forward !");
		} else if (instruction === "6200610063006b007700610072006400") {
			// backward
			leoMovementParams.mustMove=true;
			leoMovementParams.leftWheel=-1;
			leoMovementParams.rigthWheel=-1;
			console.log("Leo is moving backward !");
		} else if (instruction === "6c00650066007400") {
			// left
			leoMovementParams.mustMove=true;
			leoMovementParams.leftWheel=-1;
			leoMovementParams.rigthWheel=1;
			console.log("Leo is turning forward !");
		} else if (instruction === "72006900670068007400") {
			// left
			leoMovementParams.mustMove=true;
			leoMovementParams.leftWheel=1;
			leoMovementParams.rigthWheel=-1;
			console.log("Leo is turning rigth !");
		} else if (instruction === "730074006f007000"){
			console.log("Leo is stopping !");
		}

		// Contrôle de la roue gauche
		Cylon.robot({
			connections: {
				raspi: { adaptor: 'raspi' }
			},
			
			devices: {
				led: { driver: 'led', pin: 11}
			},
			
			work: function(my) {
				if (leoMovementParams.mustMove) {
					// Mise en mouvement du robot
					if (!isLeoMoving) {
						// Pin de contrôle principal du driver de la roue gauche
						my.led.turnOn();
					}
					isLeoMoving = true;
				} else {
					// Arrêt complet du robot
					if (isLeoMoving) {
						my.led.turnOff();
					}
					isLeoMoving = false;
				}
			}
		}).start();

		// Gestion des 2 pins du driver du driver du moteur de la roue gauche
		Cylon.robot({
			connections: {
				raspi: { adaptor: 'raspi' }
			},
			
			devices: {
				led: { driver: 'led', pin: 13}		
			},
			
			work: function(my) {
				if (leoMovementParams.leftWheel === 1) {
					// marche avant
					my.led.turnOn();					
				} else if (leoMovementParams.leftWheel === -1) {
					// marche arrière
					my.led.turnOff();
				}
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
				if (leoMovementParams.leftWheel === 1) {
					// marche avant
					my.led.turnOff();					
				} else if (leoMovementParams.leftWheel === -1) {
					// marche arrière
					my.led.turnOn();
				}
			}
		}).start();

		// TODO Contrôle de la roue droite
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