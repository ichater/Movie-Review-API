const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let User = require("../models/user.model");
let MovieList = require("../models/movielist.model");
const config = require("config");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/movielist/:userId").get((req, res) => {
  MovieList.find({ userId: req.params.userId })
    .then((movieList) => res.json(movieList))
    .catch((err) => res.status(400).json("Error" + err));
});

router
  .route("/register")
  .post(
    [
      check("username", "username is required").not().isEmpty(),
      check("password", "password is required").not().isEmpty(),
      check("email", "please include an email").isEmail(),
      check("description", "Tell us who you are now!").not().isEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json(errors);
      }

      const { description, email, password, username } = req.body;

      try {
        let user = await User.findOne({ email });
        if (user) {
          res.status(400).json({ errors: [{ msg: "User already exists" }] });
        }
        user = new User({ username, email, description, password });

        //Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

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

router
  .route("/:id")
  .get((req, res) => {
    User.findById(req.params.id)
      .then((user) => res.json(user))
      .catch((err) => res.status(400).json("Error" + err));
  })
  .delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
      .then(() => res.json("user deleted"))
      .catch((err) => res.status(400).json("Error" + err));
  });

router.route("/update/:id").post((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user.username = req.body.username;
      user.email = req.body.email;
      user.description = req.body.description;

      user
        .save()
        .then(() => res.json("user updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
