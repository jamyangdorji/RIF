const express = require("express");
var cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://akshaybenny:Admin%40123@coit20269.4un2j.mongodb.net/?retryWrites=true&w=majority&ssl=true";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Global for general use
var userCollection;
var solutionCollection;
var solutionRatingCollection;
const { ObjectId } = require('mongodb'); // Import ObjectId from the MongoDB package

// Asynchronous function to connect to MongoDB and then start the server
const startServer = async () => {
	try {
		await client.connect();
		userCollection = client.db("repair_it_yourself").collection("users");
		solutionCollection = client.db("repair_it_yourself").collection("solutions");
		solutionRatingCollection = client.db("repair_it_yourself").collection("solution_rating");
		console.log('Database connected successfully!\n');

		// Start Express server
		app.listen(port, () => {
			console.log(`Repair It Yourself server app is listening at http://localhost:${port}`);
		});
	} catch (err) {
		console.error('Failed to connect to MongoDB:', err);
		process.exit(1); // Exit if connection fails
	}
};

// Start the server only after a successful MongoDB connection
startServer();

app.get("/", (req, res) => {
	res.send("<h3>Welcome to Repair It Yourself server app!</h3>");
});

// Create User 
app.post('/addUser', (req, res) => {

	console.log("User POST request received: " + JSON.stringify(req.body) + "\n");

	userCollection.insertOne(req.body, function (err, result) {
		if (err) {
			console.error("Error inserting user data: " + err + "\n");
			res.status(500).send({ error: "An error occurred while inserting user data." });
		} else {
			console.log("User record with ID " + result.insertedId + " has been inserted\n");
			res.status(200).send(result);
		}
	});

});

//Login

app.post('/verifyUser', (req, res) => {

	console.log("POST request received : " + JSON.stringify(req.body) + "\n");

	loginData = req.body;

	userCollection.find({ email: loginData.email, password: loginData.password }, {}).toArray(function (err, docs) {
		if (err) {
			console.log("Some error.. " + err + "\n");
			res.send(err);
		} else {
			console.log(JSON.stringify(docs) + " have been retrieved.\n");
			res.status(200).send(docs);
		}

	});

});


// Retrive User
app.get('/getUser', (req, res) => {

	console.log("GET user request received\n");

	userCollection.find({}, { projection: { _id: 0 } }).toArray(function (err, docs) {
		if (err) {
			console.log("Some error.. " + err + "\n");
			res.send(err);
		} else {
			console.log(JSON.stringify(docs) + " have been retrieved.\n");
			res.status(200).send(JSON.stringify(docs));
		}

	});

});

// Retrive user using email
app.get('/getUserByEmail', (req, res) => {
	const email = req.query.email;

	if (!email) {
		res.status(400).send({ error: "Please enter email address." });
	}

	console.log(`GET user request received for email: ${email}\n`);
	userCollection.findOne({ email: email }, { projection: { _id: 0 } }, (err, doc) => {

		if (err) {
			console.error("Error retrieving user: ", err);
			res.status(500).send({ error: "Internal Server Error" });
		} else if (!doc) {
			res.status(404).send({ error: "User record not found" });
		} else {
			console.log(JSON.stringify(doc) + " has been retrieved.\n");
			res.status(200).send(doc);
		}

	});
});




// Create Solution

app.post('/addSolution', (req, res) => {

	console.log("Solution POST request received: " + JSON.stringify(req.body) + "\n");

	solutionCollection.insertOne(req.body, function (err, result) {
		if (err) {
			console.error("Error inserting solution data: " + err + "\n");
			res.status(500).send({ error: "An error occurred while inserting solution data." });
		} else {
			console.log("solution record with ID " + result.insertedId + " has been inserted\n");
			res.status(200).send(result);
		}
	});

});


// Retrive Solution
app.get('/getSolution', (req, res) => {

	console.log("GET solution request received\n");

	solutionCollection.find({}, {}).toArray(function (err, docs) {
		if (err) {
			console.log("Some error.. " + err + "\n");
			res.send(err);
		} else {
			console.log(JSON.stringify(docs) + " have been retrieved.\n");
			res.status(200).send(docs);
		}

	});

});


// Retrive Solution by ID
app.get('/getSolutionById', (req, res) => {
	const id = req.query._id;

	if (!id) {
		res.status(400).send({ error: "Solution id missing" });
		return;
	}
	try {
		const objectId = new ObjectId(id); // Convert string to ObjectId
		solutionCollection.findOne({ _id: objectId }, { projection: { _id: 0 } }, (err, doc) => {
			if (err) {
				console.error("Error retrieving solution: ", err);
				res.status(500).send({ error: "Internal Server Error" });
			} else if (!doc) {
				res.status(404).send({ error: "Solution record not found" });
			} else {
				console.log(JSON.stringify(doc) + " has been retrieved.\n");
				res.status(200).send(doc);
			}

		});
	} catch (error) {
		console.error("Invalid ObjectId format: ", error);
		res.status(400).send({ error: "Invalid Solution ID format" });
	}
});



// Sort Solution by ID in Descending order
app.get('/searchSolution', (req, res) => {

	console.log("SEARCH solution request received \n");

	const searchParam = req.query.searchParam;

	solutionCollection.find({ $or: [{ solutionHeading: { $regex: searchParam, $options: "i" } }, { description: { $regex: searchParam, $options: "i" } }] }, {}).sort({ id: -1 }).toArray(function (err, docs) {
		if (err) {
			console.log("Some error.. " + err + "\n");
			res.send(err);
		} else {
			console.log(JSON.stringify(docs) + " have been retrieved sorted by ID in descending order.\n");
			res.status(200).send(docs);
		}

	});

});

// get Solution Rating by SolutionID
app.get('/getSolutionRatingBySolutionId', (req, res) => {

	const id = req.query.solution_id;

	solutionRatingCollection.find({ soultion_id: id }, { projection: { _id: 0 } }).toArray(function (err, docs) {
		if (err) {
			console.log("Some error.. " + err + "\n");
			res.send(err);
		} else {
			console.log(JSON.stringify(docs) + " have been retrieved .\n");
			res.status(200).send(JSON.stringify(docs));
		}

	});

});

// get Solution Rating by SolutionID and UserID
app.get('/getUserSolutionRating', (req, res) => {

	const solution_id = req.query.solutionId;
	const user_id = req.query.userId;

	solutionRatingCollection.find({ solution_id: solution_id, user_id: user_id }, { projection: { _id: 0 } }).toArray(function (err, docs) {
		if (err) {
			console.log("Some error.. " + err + "\n");
			res.send(err);
		} else {
			console.log(JSON.stringify(docs) + " have been retrieved .\n");
			res.status(200).send(JSON.stringify(docs));
		}

	});

});

// Create Solution Rating

app.post('/addSolutionRating', (req, res) => {

	console.log("Solution Rating POST request received: " + JSON.stringify(req.body) + "\n");

	solutionRatingCollection.insertOne(req.body, function (err, result) {
		if (err) {
			console.error("Error inserting solution data: " + err + "\n");
			res.status(500).send({ error: "An error occurred while inserting solution data." });
		} else {
			console.log("solution rating record with ID " + result.insertedId + " has been inserted\n");
			res.status(200).send(result);
		}
	});

});