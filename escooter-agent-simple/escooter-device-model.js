const DeviceState = {
	ON: 'On',
	OFF: 'Off',
  };

const CAMPUS_POS = { latitude: 44.147714661894824, longitude: 12.236237997962611 }

class EScooterDevice {

	constructor() {
		this.id = null
		this.state = DeviceState.OFF
		this.pos = CAMPUS_POS
		this.batteryLevel = 77	
	}

	setId(id){
		this.id = id
		this.log("new device id configured: " + id)
	}

	getId(){
		return this.id
	}

	getState(){
		return this.state
	}

	isOn(){
		return this.state == DeviceState.ON
	}

	isOff(){
		return this.state == DeviceState.OFF
	}

	getBatteryLevel(){
		return this.batteryLevel
	}

	getPos(){
		return this.pos
	}

	setPos(pos){
		this.pos = pos
		this.log("Changed pos: " + JSON.stringify(this.pos));
	}

	turnOn(){
		this.state = DeviceState.ON;
		this.log("Turned on");
	}

	turnOff(){
		this.state = DeviceState.OFF;
		this.log("Turned off");
	}

	log(msg){
		console.log("[EScooterDevice " + this.id + "] " + msg);
	}

}

let device = new EScooterDevice()

exports.getEScooterDevice = function () {
	return device
};
  