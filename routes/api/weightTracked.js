const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route    PUT api/users/weightTracked
// @desc     Update daily weight
// @access   Private
router.put("/", [auth, []], async (req, res) => {
  const { weight, type, date } = req.body;

  const newDate = {
    weight,
    type,
    date
  };
  try {
    const user = await User.findOne({ _id: req.user.id });

    const reqDate = new Date(date);

    const existingDate = user.weightTracked.find(x => {
      const newDate = new Date(x.date);
      return (
        newDate.getDate() === reqDate.getDate() &&
        newDate.getMonth() === reqDate.getMonth() &&
        newDate.getFullYear() === reqDate.getFullYear()
      );
    });

    existingDate
      ? (existingDate.weightTracked = weight) && (existingDate.type = type)
      : user.weightTracked.unshift(newDate);

    await user.save();

    res.json(user.weightTracked);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
