const mongoose = require("mongoose");

const profilesScheme = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
    minlength: 50,
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