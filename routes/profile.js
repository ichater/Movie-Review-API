const router = require("express").Router();
const auth = require("../middleware/auth");
const Profile = require("../models/profiles.model");
const User = require("../models/user.model");
const { check, validationResult } = require("express-validator");

//get profile/me
router.route("/me").get(auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["username"]);

    if (!profile) {
      return res.status(400).json({ msg: "there is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// Post /profile
// Create or update a user profile
//private

router.route("/").post(
  //if more than one middleware between method and response it needs to be in square brackets[]
  [auth, check("description", "description is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { location, description, filmQuotes, likesAboutMovies } = req.body;
    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (location) profileFields.location = location;
    if (description) profileFields.description = description;
    if (filmQuotes) {
      profileFields.filmQuotes = filmQuotes
        .split(",")
        .map((quote) => quote.trim());
    }
    if (likesAboutMovies) profileFields.likesAboutMovies = likesAboutMovies;
    console.log(profileFields.filmQuotes);
    res.send("working");
  }
);

module.exports = router;
