/* COMPANY DASHBOARD */

const express  = require("express");
const app = express()

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 

const axios = require("axios");
const { send } = require("express/lib/response");

app.use(express.static('public'));

/* --------------------------------------------------------------------- */

const PORT  = 5200

// var model = require('./escooter-model');

app.get("/", (req, res) => {
	res.send("Company dashboard endpoint.")
})

app.get("/escooters", async (req, res) => {
	try {
		const resp = await axios.get("http://localhost:5060/escooters/state")
		res.send(resp.data)
	} catch (e) {
		res.sendStatus(400);
	}
})

app.listen(PORT, () => {
	console.log("Company dashboard endpoint at " + PORT)
})

