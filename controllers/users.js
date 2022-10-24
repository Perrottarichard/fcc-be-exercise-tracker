const express = require("express");
const User = require("../models/UserSchema");
const Exercise = require("../models/ExerciseSchema");
const router = express.Router();

router.post("/", async (request, response) => {
  const newUser = new User(request.body);
  const savedUser = await newUser.save();
  response.status(201).json(savedUser);
});

router.get("/", async (request, response) => {
  const users = await User.find({});
  response.status(200).json(users);
});

router.post("/:_id/exercises", async (request, response) => {
  const exercise = {
    ...request.body,
    user_id: request.params._id,
  };
  const user = await User.findById(request.params._id);
  delete exercise._id;
  const createdExercise = new Exercise(exercise);
  await createdExercise.save();
  response.status(201).json({
    username: user.username,
    _id: user._id,
    description: request.body.description,
    date: new Date(request.body.date).toDateString(),
    duration: +request.body.duration,
  });
});

router.get("/:_id/logs", async (request, response) => {
  let queries = request.query;
  const user = await User.findById(request.params._id);
  const exercises = await Exercise.find({ user_id: request.params._id });
  console.log("queries", queries);
  let filtered = [...exercises];

  if (queries?.from) {
    filtered = filtered.filter(
      (x) => new Date(x.date) >= new Date(queries?.from)
    );
    console.log("fromFilter", filtered);
  }
  if (queries?.to) {
    filtered = filtered.filter(
      (x) => new Date(x.date) <= new Date(queries?.to)
    );
    console.log("toFilter", filtered);
  }
  if (queries?.limit) {
    filtered = filtered.slice(0, queries?.limit ?? exercises.length);
  }

  const formattedExercises = filtered.map((x) => {
    return {
      description: x.description,
      duration: x.duration,
      date: new Date(x.date).toDateString(),
    };
  });
  console.log("formattedExercises", formattedExercises);
  const formattedRes = {
    _id: user._id,
    username: user.username,
    count: exercises.length,
    log: formattedExercises,
  };
  response.status(200).json(formattedRes);
});

module.exports = router;
