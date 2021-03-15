const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route    PUT api/users/exercisesTracked
// @desc     Add tracked exercises
// @access   Private
router.put("/", [auth, []], async (req, res) => {
  const { exercises } = req.body;

  try {
    const user = await User.findOne({ _id: req.user.id });

    exercises.forEach(x => {
      user.exercisesTracked.unshift(x);
    });

    await user.save();

    res.json(user.exercisesTracked);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/users/exercisesTracked/:id
// @desc     Delete a tracked exercise
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    const exercise = user.exercisesTracked.find(x => {
      return x.id === req.params.id;
    });

    if (!exercise) {
      return res.status(404).json({ msg: "Tracked exercise not found" });
    }

    await exercise.remove();

    await user.save();

    res.json({ msg: "Tracked exercise removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/users/exercisesTracked/sets
// @desc     Add set to tracked exercise
// @access   Private
router.put("/sets", [auth, []], async (req, res) => {
  const { weightdistance, repstime, exerciseid } = req.body;

  const newSet = {
    weightdistance,
    repstime,
    exerciseid
  };

  try {
    const user = await User.findOne({ _id: req.user.id });

    const exercise = user.exercisesTracked.find(x => {
      return x.id === exerciseid;
    });

    exercise.sets.unshift(newSet);

    await user.save();

    res.json(user.exercisesTracked);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/users/exercisesTracked/:exerciseid/sets/:setid
// @desc     Delete a set
// @access   Private
router.delete("/:exerciseid/sets/:setid", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    const exercise = user.exercisesTracked.find(x => {
      return x.id === req.params.exerciseid;
    });

    if (!exercise) {
      return res.status(404).json({ msg: "Tracked exercise not found" });
    }

    const set = exercise.sets.find(x => {
      return x.id === req.params.setid;
    });

    if (!set) {
      return res.status(404).json({ msg: "Set in tracked exercise not found" });
    }

    await set.remove();

    await user.save();

    res.json({ msg: "Tracked exercise removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
