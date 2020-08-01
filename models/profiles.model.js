const mongoose = require("mongoose");

const profilesScheme = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  location: {
    type: String,
  },
  description: {
    type: String,
    minlength: 50,
    required: true,
  },
  filmQuotes: {
    type: [String],
  },
  likesAboutMovies: {
    type: String,
    minlength: 50,
  },
});

const Profile = mongoose.model("profile", profilesScheme);

module.exports = Profile;
