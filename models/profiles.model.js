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
    // minlength: 50,
    required: true,
  },
  filmQuotes: [
    {
      quote: {
        type: String,
        required: true,
      },
      film: {
        type: String,
        required: true,
      },
    },
  ],
  likesAboutMovies: {
    type: String,
  },

  avatar: {
    type: String,
    required: false,
  },
});

const Profile = mongoose.model("profile", profilesScheme);

module.exports = Profile;
