const router = require("express").Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../models/profiles.model");
const User = require("../models/user.model");

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
      profileFields.filmQuotes = filmQuotes;
      // .split(",")
      // .map((quote) => quote.trim());
    }
    if (likesAboutMovies) profileFields.likesAboutMovies = likesAboutMovies;

    // try {
    //   let profile = await Profile.findOneAndUpdate({ user: req.user.id });
    //   if (profile) {
    //     //Update
    //     profile = await Profile.findOneAndUpdate(
    //       { user: req.user.id },
    //       { $set: profileFields },
    //       { new: true }
    //     );

    //     // { new: true, upsert: true }
    //     console.log(profile);
    //     return res.json(profile);
    //   }

    //   //Create
    //   profile = new Profile(profileFields);
    //   await profile.save();
    //   res.json(profile);
    // } catch (err) {
    //   console.error(err.message);
    //   res.status(400).send("Server Error");
    // }

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Get All Profiles
router.route("/").get(async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["username"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Get specific users profile via id
router.route("/user/:id").get(async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.id,
    }).populate("user", ["username"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("server errors");
  }
});

// DELETE api/profile
// Delete profile, user and posts
// Private
router.route("/").delete(auth, async (req, res) => {
  try {
    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT api/profile/movieQuotes
// Delete profile, user and posts
// Private
router.put(
  "/moviequotes",
  // [
  auth,

  //   [
  //     check("film", "film is required").not().isEmpty,
  //     check("quote", "movie quote is required").not().isEmpty,
  //   ],
  // ],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const { film, quote } = req.body;
    const newMovieQUote = { film, quote };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.filmQuotes.push(newMovieQUote);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Delete movie quote from profile
// Private
router.delete("/moviequotes/:quote_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    console.log(
      profile.filmQuotes.map((item) => item.id).indexOf(req.params.quote_id)
    );
    // get remove index
    const removeIndex = profile.filmQuotes
      .map((item) => item.id)
      .indexOf(req.params.quote_id);

    console.log(removeIndex);

    profile.filmQuotes.splice(removeIndex, 1);

    console.log(profile.filmQuotes.splice(removeIndex, 1));

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
