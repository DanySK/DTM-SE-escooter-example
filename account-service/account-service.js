/* ACCOUNT MICRO-SERVICE */
  
const express  = require("express");
const app = express()

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 

const axios = require("axios");

const { resetWatchers } = require("nodemon/lib/monitor/watch");

/* --------------------------------------------------------------------- */

const PORT  = 5050

var model = require('./account-model');

app.get("/", (req, res) => {
	res.send("This is the account service.")
})

/* Get the list of current accounts */

app.get("/accounts",async (req, res) => {
	res.send(model.getAccountModel().getAllAccountsId())
})

/* Get info about an existing account */

app.get("/accounts/:uid",async (req, res) => {
	try {
		user = model.getAccountModel().getAccountById(req.params.uid)
		res.send(JSON.stringify(user))
	} catch (e){
		res.sendStatus(404)
	}
})

/* Register a new user */

app.post("/accounts", async (req, res) => {
	try {
		model.getAccountModel().registerNewUser(req.body.username, req.body.name, req.body.surname)
		res.send(model.getAccountModel().getAccountById(req.body.username))
	} catch (err){
		res.sendStatus(400);
	}	
})

app.listen(PORT, () => {
	console.log("Account service up and running - listening on port " + PORT)
})
