/* COMPANY DASHBOARD */

const express  = require("express");
const app = express()

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 

const path = require('path');
const axios = require("axios");

app.use(express.static('public'));

/* --------------------------------------------------------------------- */

const PORT  = 5300

// var model = require('./escooter-model');

app.get("/", (req, res) => {
	res.send("User app backend endpoint.")
})

app.post("/submit-registration-form", async (req, res) => {
	try {
		const userData = req.body
		try {
			const resp = await axios.post("http://localhost:5050/accounts",
				{
					"name": userData.fname,
					"surname": userData.lname,
					"username": userData.uname
				})
			res.sendFile(path.join(__dirname, '/public/registration-ok.html'));
		} catch (e) {
			res.sendFile(path.join(__dirname, '/public/registration-failed.html'));
		}
	} catch (e) {
		res.sendStatus(400);
	}
})

app.listen(PORT, () => {
	console.log("User app backend un and running at " + PORT)
})

