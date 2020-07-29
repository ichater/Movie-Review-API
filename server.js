const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const methodOverRide = require("method-override");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
// used to be 'body parser
app.use(express.json());
app.use(methodOverRide("_method"));

//Routes below connected via files
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const movieListRouter = require("./routes/movieList");
app.use("/movielist", movieListRouter);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
