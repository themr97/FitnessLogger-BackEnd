const express = require("express");
const compression = require("compression");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// Compress responses
app.use(compression());

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/exercises", require("./routes/api/exercises"));
app.use("/api/exercisesTracked", require("./routes/api/exercisesTracked"));
app.use("/api/foods", require("./routes/api/foods"));
app.use("/api/foodsTracked", require("./routes/api/foodsTracked"));
app.use("/api/workouts", require("./routes/api/workouts"));
app.use("/api/weightTracked", require("./routes/api/weightTracked"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.get('/',(req,res) =>{
  res.send("Fitness Logger API")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
