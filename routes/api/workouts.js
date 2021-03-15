const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route    PUT api/users/workouts
// @desc     Create Workout
// @access   Private
router.put("/", [auth, []], async (req, res) => {
  const { name, exercises } = req.body;

  const newWorkout = {
    name: name,
    exercises: exercises
  };

  try {
    const user = await User.findOne({ _id: req.user.id });

    user.workouts.unshift(newWorkout);

    await user.save();

    res.json(user.workouts);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/users/workouts/:id
// @desc     Delete a workout
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    const workout = user.workouts.find(x => {
      return x.id === req.params.id;
    });

    if (!workout) {
      return res.status(404).json({ msg: "Workout not found" });
    }

    await workout.remove();

    await user.save();

    res.json({ msg: "Workout deleted" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/users/workouts/:id
// @desc     EDIT workout
// @access   Private
router.put("/:id", [auth, []], async (req, res) => {
  const { name, exercises } = req.body;

  try {
    const user = await User.findOne({ _id: req.user.id });
    const workout = user.workouts.find(x => {
      return x.id === req.params.id;
    });

    if (!workout) {
      return res.status(404).json({ msg: "Exercise not found" });
    }

    workout.name = name;
    workout.exercises = exercises;

    await user.save();

    res.json(user.workouts);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
