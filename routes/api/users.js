const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const dotenv = require("dotenv");


dotenv.config();

const User = require("../../models/User");

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
        exercises: [],
        workouts: [],
        exercisesTracked: [],
        weight: []
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      user.exercises.unshift({ name: "Barbell Bench Press", type: "lbs" });
      user.exercises.unshift({ name: "Barbell Row", type: "lbs" });
      user.exercises.unshift({ name: "Barbell Squat", type: "lbs" });
      user.exercises.unshift({ name: "Running", type: "mi" });

      user.workouts.unshift({
        name: "Full Body",
        exercises: [
          { name: "Barbell Bench Press", type: "lbs" },
          { name: "Barbell Row", type: "lbs" },
          { name: "Barbell Squat", type: "lbs" },
          { name: "Running", type: "mi" }
        ]
      });

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
