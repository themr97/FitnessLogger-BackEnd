const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  workouts: [
    {
      name: String,
      exercises: [{ name: { type: String }, type: { type: String } }]
    }
  ],
  exercises: [{ name: { type: String }, type: { type: String } }],
  exercisesTracked: [
    {
      date: { type: Date },
      name: { type: String },
      type: { type: String },
      sets: [{ weightdistance: { type: Number }, repstime: { type: Number } }]
    }
  ],
  weightTracked: [
    {
      date: { type: Date },
      type: { type: String },
      weight: { type: Number }
    }
  ],
  foods: [
    {
      name: { type: String },
      calories: { type: Number },
      proteins: { type: Number },
      fats: { type: Number },
      carbs: { type: Number },
      type: { type: String }
    }
  ],
  foodsTracked: [
    {
      name: { type: String },
      calories: { type: Number },
      proteins: { type: Number },
      fats: { type: Number },
      carbs: { type: Number },
      date: { type: Date },
      type: { type: String },
      quantity: { type: Number }
    }
  ]
});

module.exports = User = mongoose.model("user", UserSchema);
