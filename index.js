var bleno = require("bleno");
var BlenoPrimaryService = bleno.PrimaryService;
var Characteristic = bleno.Characteristic;

var uuidHWService = "hw00";

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
						properties:["indicate"],
						value:null,
						onIndicate:function() {
							console.log("onIndicate");
							return "HelloWorld";
						}
					})
				]
			})
		]);
	}
});