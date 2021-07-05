const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");

//changed from default port because was using default port to test another app, 8001 was free
const PORT = process.env.PORT || 8001;
const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Using MONGODB_URI to hook up Heroku to mongodb atlas, otherwise using localhost mongodb
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fittrack", {
	useNewUrlParser: true,
});

// add exercise route
app.get("/exercise", (req, res) => {
	res.sendFile(path.join(__dirname, "./public/exercise.html"));
});
// workout route
app.get("/stats", (req, res) => {
	res.sendFile(path.join(__dirname, "./public/stats.html"));
});
// workout data
app.get("/api/workouts", (req, res) => {
	db.Workout.find({}, null, { sort: { day: 1 } })
		.populate("exercises")
		.then((dbWorkout) => {
			res.json(dbWorkout);
		})
		.catch((err) => {
			res.json(err);
		});
});

// update workout- from class activity
app.put("/api/workouts/:id", (req, res) => {
	var workoutID = req.params.id;
	db.Exercise.create(req.body)
		.then(({ _id }) =>
			db.Workout.findOneAndUpdate(
				{ _id: workoutID },
				{ $push: { exercises: _id } },
				{ new: true }
			)
		)
		.then((dbWorkout) => {
			res.json(dbWorkout);
		})
		.catch((err) => {
			res.json(err);
		});
});

// new workout route
app.post("/api/workouts", (req, res) => {
	db.Workout.create(req.body)
		.then((dbWorkout) => {
			res.json(dbWorkout);
		})
		.catch((err) => {
			res.json(err);
		});
});

// dashboard route
app.get("/api/workouts/range", (req, res) => {
	db.Workout.find({}, null, { sort: { day: 1 } })
		.populate("exercises")
		.then((dbWorkout) => {
			res.json(dbWorkout);
		})
		.catch((err) => {
			res.json(err);
		});
});

// server port - 8001
app.listen(PORT, () => {
	console.log(`App running on port ${PORT}!`);
});
