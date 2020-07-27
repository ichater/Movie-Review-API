const mongoose = require("mongoose");
const { userSchema, User } = require("./user.model");
const Schema = mongoose.Schema;

const movieListSchema = new Schema(
  {
    list: {
      type: [
        {
          title: String,
          year: Number,
        },
      ],
      minlength: 0,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestapms: true,
  }
);

const MovieList = mongoose.model("movielist", movieListSchema);

module.exports = MovieList;
