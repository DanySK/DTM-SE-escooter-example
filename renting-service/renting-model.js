
class RentEvent {
	constructor(time, what) {
		this.time = time
		this.what = what
	}
}

class Rent {

	constructor(id, userId, escooterId) {
		this.id = id
		this.userId = userId
		this.escooterId = escooterId
		const time = Date.now()
		this.events = [
			new RentEvent(time,"started")
		]
	}

	getEvents(){
		return this.events
	}
	
	notifyEvent(time, what){
		this.events.push(new RentEvent(time,what))
	}

	endRenting(){
		const time = Date.now()
		this.events.push(new RentEvent(time,"completed"))
	}
	
	log(msg){
		console.log("[RideDT " + this.id + "] " + msg);
	}
}

class Renting {
	
	constructor() {
      this.rents = new Map()
	  this.rentCounter = 0;
	}

	startNewRent(userId, escooterId){
		this.rentCounter++;
		const rentId = "rent-" + this.rentCounter;
		this.log("starting a new rent: " + rentId);
		let rent = new Rent(rentId, userId, escooterId)
		this.rents.set(rentId, rent)
		return rentId
	}

	endOngoingRent(rentId){
		let rent = this.rents.get(rentId)
		if (rent != undefined){
			this.log("ending an ongoing rent: " + rentId);
			rent.endRenting()
		} else {
			throw 'rent not found'
		}
	}

	getRentById(id){
		return this.rents.get(id)
	}

	getAllRents(){
		return Array.from(this.rents.keys())
	}

	log(msg){
		console.log("[Renting] " + msg);
	}


}

let renting = new Renting()

exports.getRentingModel = function () {
	return renting;
};
  