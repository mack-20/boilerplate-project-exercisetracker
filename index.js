const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const User = require("./models/user");
const Exercise = require("./models/exercise");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use(express.json());

// Connect to the MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set POST route at /api/users
app.post("/api/users", async (req, res) => {
  try {
    const username = req.body.username;

    const user = await User.create({ username: username });

    const user_id = user._id;

    res.json({
      username: username,
      _id: user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Set GET route for a get-request to show an array of all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});

    console.log("Users found");

    res.send(users);
  } catch (error) {
    console.error(error);
  }
});

// Set POST route to /api/users/:_id/exercises
app.post("/api/users/:_id/exercises", async (req, res) => {
  const user_id = req.params._id;

  try {
    const user = await User.findById(user_id);
    const { description, duration, date } = req.body;

    if (!user) {
      res.send("No user found with this ID");
    } else {
      const exerciseDoc = new Exercise({
        user_id,
        description,
        duration,
        date: date ? new Date(date) : new Date()
      });

      const exercise = await exerciseDoc.save();

      res.json({
        username: user.username,
        _id: user_id,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString(),
      });
    }
  } catch (err) {
    console.error(err);
  }
});

// GET route to retrieve a full exercise log of any user
app.get("/api/users/:_id/logs", async (req, res) => {
  const user_id = req.params._id;
  const {from, to, limit} = req.query 
  const user = await User.findById(user_id);
  const filter = {user_id: user_id}

  if(from || to){
    dateObj = {}
    if(from){
      dateObj["$gte"] = new Date(from) 
    }

    if(to){
      dateObj["$lte"] = new Date(to)
    }

    filter.date = dateObj
    // Debugger Code
    console.log(filter)
  }

  else{
    // Do nothing
  }

  const exerciseDocs = await Exercise.find(filter).limit(+limit ?? 500)
  const exerciseCount = exerciseDocs.length
  const log = exerciseDocs.map((exercise) => {
    return{
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString()
    }
  })

  res.json({
    _id: user._id,
    username: user.username,
    count: exerciseCount,
    log: log
  })


  
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
