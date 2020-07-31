const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const methodOverRide = require("method-override");
const connectDB = require("./config/dbs");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
// used to be 'body parser
app.use(express.json());
app.use(methodOverRide("_method"));

//Routes below connected via files
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const movieListRouter = require("./routes/movieList");
app.use("/movielist", movieListRouter);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const profileRouter = require("./routes/profile");
app.use("/profile", profileRouter);

// app.use("/profile", require("./routes/profile"));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
