const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/user.model");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Authenticate user & get token
// Public
router
  .route("/")
  .post(
    [
      check("password", "Password is required").exists(),
      check("email", "Please include an email").isEmail(),
    ],
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json(errors);
      }

      const { email, password } = req.body;

      try {
        let user = await User.findOne({ email });

        // Does the user exist? if no then "Invalid credentials"
        if (!user) {
          res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
        }

        //compares password to encrypted password
        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
          res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
        }

        const payload = {
          user: {
            id: user.id,
          },
        };
        // const secretToken = "placeholderSecretToken";

        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 36000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    }
  );

module.exports = router;
