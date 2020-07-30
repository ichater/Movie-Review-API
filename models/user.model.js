const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//What attributed do you expect a User to have?
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxlength: 500,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    //what else will the user need?
  },
  {
    timestapms: true,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
