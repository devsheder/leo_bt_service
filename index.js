// rouge 5V, marron masse et orange commande, BCM 17 (pin 11)
var Cylon = require("cylon");
Cylon.robot({
	connections: {
		raspi : {adaptor : "raspi"}
	},
	devices: {
		servo : {driver : "servo", pin : 11}
	},
	work: function(my) {
		my.servo.angle(0);
	}
}).start();


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
						uuid:"fffffffffffffffffffffffffffffff0",
						properties:["read", "write"],
						value:null,
						onReadRequest:function(offset, callback) {
							callback(this.RESULT_SUCCESS, new Buffer("Hello world!"));
						},
						onWriteRequest:function(data, offset, withoutResponse, callback) {
							console.log(data.toString());
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