const router = require("express").Router();
const auth = require("../middleware/auth");
const Profile = require("../models/profiles.model");
const User = require("../models/user.model");

//get profile/me
router.route("/me").get(auth, async (req, res) => {
  try {
    const profile = await (
      await Profile.findOne({ user: req.user.id })
    ).populated("user", ["username"]);

    if (!profile) {
      return res.status(400).json({ msg: "there is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
