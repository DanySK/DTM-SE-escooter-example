const express  = require("express");
const app = express()

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 

const axios = require("axios");

/* --------------------------------------------------------------------- */

const PORT  = 5070

var model = require('./renting-model');

app.get("/", (req, res) => {
	res.send("Renting service endpoint.")
})

/* Get the list of ongoing rents */

app.get("/rents",async (req, res) => {
	res.send(model.getRentingModel().getAllRents())
})

/* Get info about a specific ongoing rent */

app.get("/rents/:uid",async (req, res) => {
	try {
		let rent = model.getRentingModel().getRentById(req.params.uid)
		res.send(JSON.stringify(rent))
	} catch (e){
		res.sendStatus(404)
	}
})

/* Start a new rent */

app.post("/rents", async (req, res) => {
	try {
		/* try to unlock the escooter */
		const escooterURI = "http://localhost:5060/escooters/" + req.body.escooterId;
		const unlockResponse = await axios.post(escooterURI + "/actions/unlock")
		
		if (unlockResponse.status === 200) {
			let rid = model.getRentingModel().startNewRent(req.body.userId, req.body.escooterId)
			res.send({ "rentId": rid })
		} else {
			res.sendStatus(400);
		}
	} catch (err){
		res.sendStatus(400);
	}	
})

/* End an ongoing rent */

app.post("/rents/:uid/actions/end",async (req, res) => {
	try {
		const rent = model.getRentingModel().getRentById(req.params.uid);		
		if (rent != undefined){ 
			/* try to lock the escooter */
			const escooterURI = "http://localhost:5060/escooters/" + rent.escooterId;
			const lockResponse = await axios.post(escooterURI + "/actions/lock")
			
			if (lockResponse.status === 200) {
				model.getRentingModel().endOngoingRent(req.params.uid);
				res.send(model.getRentingModel().getRentById(req.params.uid))
			} else {
				res.sendStatus(400);
			}
		} else {
			res.sendStatus(400);
		}

	} catch (e){
		res.sendStatus(404)
	}
})

/* Get events related to an oingoing rent */

app.get("/rents/:uid/events",async (req, res) => {
	try {
		let events = model.getRideModel().getRideById(req.params.uid).getEvents();
		res.send(JSON.stringify(events))
	} catch (e){
		res.sendStatus(404)
	}
})


/* Renting service listening on port 5070 */

app.listen(PORT, () => {
	console.log("Renting service up and running - listening on port " + PORT)
})
