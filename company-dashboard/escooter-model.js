
class EScooterDT {

	static IN_SERVICE_AVAILABLE = "in-service:available"
	static IN_SERVICE_NOT_AVAILABLE_IN_USE = "in-service:not-available:in-use"
	static OUT_OF_SERVICE_NEED_MAINTENANCE = "out-of-service:need-maintenance"
	static OUT_OF_SERVICE_IN_MAINTENANCE = "out-of-service:in-maintenance"
	static OUT_OF_SERVICE_BROKEN = "out-of-service:broken"
	static OUT_OF_SERVICE_LOST = "out-of-service:lost"

	constructor(id) {
		this.id = id
		this.serviceState = EScooterDT.IN_SERVICE_AVAILABLE;
		this.deviceState = {
			state: null,
			pos: null,
			batteryLevel: null
		}
	}

	getState(){
		return this.state
	}

	unlock() {
		if (this.serviceState == EScooterDT.IN_SERVICE_AVAILABLE){
			this.serviceState = EScooterDT.IN_SERVICE_NOT_AVAILABLE_IN_USE;
			this.log("unlock request succeded")
		} else {
			this.log("unlock request failed")
			throw 'not available'
		}
	}

	lock() {
		if (this.serviceState == EScooterDT.IN_SERVICE_NOT_AVAILABLE_IN_USE){
			this.serviceState = EScooterDT.IN_SERVICE_AVAILABLE;
			this.log("lock request succeeded")
		} else {
			this.log("lock request failed")
			throw 'already locked'
		}
	}
	
	sync(state, pos, batteryLevel){
		this.log("sync")
		this.deviceState = {
			state: state,
			pos: pos,
			batteryLevel: batteryLevel
		}
	}

	log(msg){
		console.log("[EScooterDT " + this.id + "] " + msg);
	}

}

class EScooters {
	
	constructor() {
      this.scooters = new Map()
	  this.scooters.set("escooter-001", new EScooterDT("escooter-001"))
	}

	registerNewEScooter(id){
		console.log("Registering new e-scooter: " + id)
		if (!this.isEScooterAlreadyRegistered(id)){
			console.log("GOOD: not present")
			this.scooters.set(id, new EScooterDT(id))
		} else {
			console.log("BAD: e-scooter already registered")
			throw 'Duplicate id'
		}
	}

	isEScooterAlreadyRegistered(id){
		return this.scooters.get(id) != undefined
	}

	getEScooterById(id){
		return this.scooters.get(id)
	}

	getAllEScooters(){
		return Array.from(this.scooters.keys())
	}

	// to access the individual EScooter DT

	lockEScooter(id){
		console.log("model:lock " + id)
		this.scooters.get(id).lock();
	}

	unlockEScooter(id){
		console.log("model:unlock " + id)
		this.scooters.get(id).unlock();
	}

	syncEScooter(id,state, pos, batteryLevel){
		this.scooters.get(id).sync(state, pos, batteryLevel);
	}


}

let scooters = new EScooters()

exports.getEScooterModel = function () {
	return scooters
};
  