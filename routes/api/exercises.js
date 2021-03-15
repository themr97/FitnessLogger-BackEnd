const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route    PUT api/exercises
// @desc     Add exercise
// @access   Private
router.put("/", [auth, []], async (req, res) => {
  const { name, type } = req.body;

  const newExercise = {
    name,
    type
  };

  try {
    const user = await User.findOne({ _id: req.user.id });

    user.exercises.unshift(newExercise);

    await user.save();

    res.json(user.exercises);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/exercises/:id
// @desc     Delete an exercise
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    const exercise = user.exercises.find(x => {
      return x.id === req.params.id;
    });

    if (!exercise) {
      return res.status(404).json({ msg: "Exercise not found" });
    }

    await exercise.remove();

    await user.save();

    res.json({ msg: "Exercise removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/users/exercises/:id
// @desc     EDIT exercise
// @access   Private
router.put("/:id", [auth, []], async (req, res) => {
  const { name, type } = req.body;

  try {
    const user = await User.findOne({ _id: req.user.id });
    const exercise = user.exercises.find(x => {
      return x.id === req.params.id;
    });

    if (!exercise) {
      return res.status(404).json({ msg: "Exercise not found" });
    }

    exercise.name = name;
    exercise.type = type;

    await user.save();

    res.json(user.exercises);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
