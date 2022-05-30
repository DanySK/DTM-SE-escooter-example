/* E-Scooter embedded software agent */

const express  = require("express");
const app = express()

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 

const axios = require("axios");
const geolib = require('geolib');

/* --------------------------------------------------------------------- */

const PORT  = 5100

const PERIOD = 100

var model = require('./escooter-device-model');

/* agent event queue */
let events = []

/* keeping track of agent cycle number */ 
let currentCycle = 0;

/* configuring agent periodic behaviour:
   doing an execution cycle every PERIOD milliseconds */
let timerId = setInterval(() => doExecutionCycle(), PERIOD);

/* current perceived event */
let perceivedEvent = null;

/* agent main execution cycle, called periodically */
async function doExecutionCycle() {
	currentCycle++
	perceivedEvent = null;
	if (events.length > 0){
		perceivedEvent = events.shift()
	}
	doStep();
}

/* --------------------------------------------------------------------- */

/* Agent business logic */

const AgentState = {
	IDLE: 'Idle',
	DRIVING: 'Driving',
	AUTOMODE: 'Automode'
  };

let lastSyncTime = 0;
let currentState = AgentState.IDLE;
let targetPosIndex = 0

const autoModePath = [
	{ latitude: 44.147714661894824, longitude: 12.236237997962611 },
	{ latitude: 44.14402476949777, longitude: 12.239347039196907 },
	{ latitude: 44.143562020452784, longitude: 12.238512012670611 },
	{ latitude: 44.1472901142956, longitude: 12.235195682076087 }
]

/*  Main function defining agent behaviour at each cycle */
/*  It is a finite state machine */

function doStep(){
	checkSync()
	switch (currentState) {
		case AgentState.IDLE:
			if (perceivedEvent != null && perceivedEvent.event == "turn-on-request"){
				model.getEScooterDevice().turnOn()	
				currentState = AgentState.DRIVING
			}
		break;
		case AgentState.DRIVING:
			if (perceivedEvent != null){
				if  (perceivedEvent.event == "turn-off-request"){
					model.getEScooterDevice().turnOff()	
					currentState = AgentState.IDLE
				} else if (perceivedEvent.event == "activate-automode-request"){
					currentState = AgentState.AUTOMODE
					model.getEScooterDevice().setPos(autoModePath[0])
					targetPosIndex = 1
				}
			}
		break;
		case AgentState.AUTOMODE:
			if  (perceivedEvent != null && perceivedEvent.event == "stop-automode-request"){
				currentState = AgentState.DRIVING
			} else {
				console.log("moving in automode")
				let targetPos = autoModePath[targetPosIndex]
				if (reached(targetPos)){
					targetPosIndex = (targetPosIndex + 1) % autoModePath.length
					targetPos = autoModePath[targetPosIndex]
					console.log("waypoint reached, moving to next one " + targetPos)
				}
				moveTowardsTarget(targetPos, 1)
			}
		break;	
		default:
	}
}

/* check if it is time for synching the physical asset with the digital twin */

async function checkSync(){	
	const devId = model.getEScooterDevice().getId();
	/* if the device has been configured with an id */
	if (devId != null){
		const time = Date.now()
		const elapsed = time - lastSyncTime
		if ((model.getEScooterDevice().isOn() && elapsed > 1000) ||
			(model.getEScooterDevice().isOff() && elapsed > 4000)){
				lastSyncTime = time
				sync()
		}
	}
}

/* synch the physical asset with the digital twin */

async function sync(){
	const devId = model.getEScooterDevice().getId();

	const escooterURI = "http://localhost:5060/escooters/" + devId;
	const syncResponse = await axios.post(escooterURI + "/actions/sync",
			{
				state: model.getEScooterDevice().getState(),
				pos: model.getEScooterDevice().getPos(),
				batteryLevel: model.getEScooterDevice().getBatteryLevel(),
			}
	)
	if (syncResponse.status != 200){
		console.log("sync not succeeded.")
	} else {
		console.log("sync ok.")
	}
}

function reached(targetPos){
	const currentPos = model.getEScooterDevice().getPos()
	const dist = geolib.getDistance(currentPos, targetPos)
	return dist < 1.0
}

function moveTowardsTarget(targetPos, stepSize){
	const currentPos = model.getEScooterDevice().getPos()
	let bearing = geolib.getRhumbLineBearing(currentPos, targetPos)
	const nextPos = geolib.computeDestinationPoint(currentPos, stepSize, bearing)
	model.getEScooterDevice().setPos(nextPos)
}

/* --------------------------------------------------------------------- */

/* configuring the device id */

app.put("/id", async (req, res) => {
	model.getEScooterDevice().setId(req.body.escooterId) 
	res.sendStatus(200);
})

/* notifying events to the agent */

app.post("/events", async (req, res) => {
	try {
		if (events.length > 100){
			events.shift()
		}
		
		events.push({
				time: Date.now(),
				event: req.body.event,
				content: req.body.content
			})
		
		console.log(req.body)
		res.sendStatus(200);
	} catch (err){
		res.sendStatus(400);
	}	
})


app.listen(PORT, () => {
	console.log("E-Scooter agent up and running - listening on port " + PORT)
})

/* Agent behaviour */


