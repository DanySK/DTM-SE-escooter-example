/* E-SCOOTER MICRO-SERVICE */

const express  = require("express");
const app = express()

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 

/* --------------------------------------------------------------------- */

const PORT  = 5060

var model = require('./escooter-model');

app.get("/", (req, res) => {
	res.send("E-Scooter service endpoint.")
})

/* getting the list of all registered escooters */

app.get("/escooters",async (req, res) => {
	res.send(model.getEScooterModel().getAllEScooters())
})

app.get("/escooters/state",async (req, res) => {
	let escootersInfo = []
	model.getEScooterModel().getAllEScooters().forEach( id => {
		const sc = model.getEScooterModel().getEScooterById(id)
		escootersInfo.push({
			id: sc.id,
			serviceState: sc.serviceState,
			deviceState: sc.deviceState
		})
	})
	res.send(JSON.stringify(escootersInfo))
})


/* Register a new e-scooter */

app.post("/escooters", async (req, res) => {
	try {
		console.log("POST register new scooter: " + JSON.stringify(req.body))
		model.getEScooterModel().registerNewEScooter(req.body.id)
		res.send(model.getEScooterModel().getEScooterById(req.body.id))
	} catch (err){
		res.sendStatus(400);
	}	
})

/* Get info about an e-scooter */

app.get("/escooters/:uid",async (req, res) => {
	try {
		sc = model.getEScooterModel().getEScooterById(req.params.uid)
		res.send({
			"id": sc.id,
			"serviceState": sc.serviceState,
			"deviceState": sc.deviceState
		})
	} catch (e){
		res.sendStatus(404)
	}
})

/* unlocking */

app.post("/escooters/:uid/actions/unlock",async (req, res) => {
	try {
		console.log("unlocking scooter " + req.params.uid)
		model.getEScooterModel().unlockEScooter(req.params.uid)
		res.send(model.getEScooterModel().getEScooterById(req.params.uid))
	} catch (e){
		console.log(e)
		res.sendStatus(400)
	}
})

/* locking */

app.post("/escooters/:uid/actions/lock",async (req, res) => {
	try {
		console.log("locking")
		model.getEScooterModel().lockEScooter(req.params.uid)
		res.send(model.getEScooterModel().getEScooterById(req.params.uid))
	} catch (e){
		res.sendStatus(400)
	}
})

/* sync the DT with the physical twin */

app.post("/escooters/:uid/actions/sync",async (req, res) => {
	try {
		console.log("sync")
		model.getEScooterModel().syncEScooter(req.params.uid, req.body.state, req.body.pos, req.body.batteryLevel)
		res.send(model.getEScooterModel().getEScooterById(req.params.uid))
	} catch (e){
		res.sendStatus(404)
	}
})


app.listen(PORT, () => {
	console.log("E-Scooter service up and running - listening on port " + PORT)
})

