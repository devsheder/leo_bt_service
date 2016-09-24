// rouge 5V, marron masse et orange commande, BCM 17 (pin 11)
var Cylon = require("cylon");
// forward = 66006f0072007700610072006400, backward = 6200610063006b007700610072006400, left = 6c00650066007400, right = 72006900670068007400, stop = "730074006f007000"
var availableInstructions = ["66006f0072007700610072006400", "6200610063006b007700610072006400", "6c00650066007400", "72006900670068007400", "730074006f007000"];

var currentRobot = 
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
			console.log("work");
			console.log(leoMovementParams);
			console.log(this.devices.led1.pin);
			
			// Mise en mouvement du robot
			if (leoMovementParams.mustMove) {
				// Pin de contrôle principal du driver de la roue gauche
				my.led1.turnOn();
				// Pin de contrôle principal du driver de la roue droite
				my.led4.turnOn();
			} else {
				// Pin de contrôle principal du driver de la roue gauche
				my.led1.turnOff();
				// Pin de contrôle principal du driver de la roue droite
				my.led4.turnOff();
			}
		
			// Gestion des pins du driver des moteurs
			if (leoMovementParams.leftWheel === 1) {
				// marche avant roue droite
				my.led2.turnOff();
				// marche avant roue gauche
				my.led3.turnOn();
			} else if (leoMovementParams.leftWheel === -1) {
				// marche arrière roue droite
				my.led2.turnOn();
				// marche arrière roue gauche
				my.led3.turnOff();
			}
		
			// Gestion des du driver du driver du moteur de la roue droite
			if (leoMovementParams.rigthWheel === 1) {
				// marche avant roue droite
				my.led5.turnOn();
				// marche avant roue gauche
				my.led6.turnOff();
				
			} else if (leoMovementParams.rigthWheel === -1) {
				// marche arrière roue droite
				my.led5.turnOff();
				// marche arrière roue gauche
				my.led6.turnOn();
			}
		}
	});
// 0 -> arrêt, 1 -> forward, -1-> backward
var leoMovementParams = {
			mustMove:false,
			leftWheel:0,
			rigthWheel:0
		};

function move(instruction) {
	if (availableInstructions.indexOf(instruction) >= 0) {	
		if (instruction === "66006f0072007700610072006400") {
			// forward
			leoMovementParams.mustMove=true;
			leoMovementParams.leftWheel=1;
			leoMovementParams.rigthWheel=1;
			console.log("Leo is moving forward !");
			isLeoMoving = true;
		} else if (instruction === "6200610063006b007700610072006400") {
			// backward
			leoMovementParams.mustMove=true;
			leoMovementParams.leftWheel=-1;
			leoMovementParams.rigthWheel=-1;
			console.log("Leo is moving backward !");
			isLeoMoving = true;
		} else if (instruction === "6c00650066007400") {
			// left
			leoMovementParams.mustMove=true;
			leoMovementParams.leftWheel=1;
			leoMovementParams.rigthWheel=-1;
			console.log("Leo is turning forward !");
			isLeoMoving = true;
		} else if (instruction === "72006900670068007400") {
			// rigth
			leoMovementParams.mustMove=true;
			leoMovementParams.leftWheel=-1;
			leoMovementParams.rigthWheel=1;
			console.log("Leo is turning rigth !");
			isLeoMoving = true;
		} else if (instruction === "730074006f007000"){
			console.log("Leo is stopping !");
			leoMovementParams.mustMove=false;
			leoMovementParams.leftWheel=0;
			leoMovementParams.rigthWheel=0;
		}
		
		// Création et stockage du robot dans une variable "d'instance"
		if(currentRobot == null) {
			
		}

		// Gestion des pin d'activation des roues
		if (leoMovementParams.mustMove) {
			currentRobot.start();
		} else {
			currentRobot.halt();
		}

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