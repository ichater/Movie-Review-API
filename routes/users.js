const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt");
let User = require("../models/user.model");
let MovieList = require("../models/movielist.model");
//How we access the user
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

// /user/movielists/id
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
        console.log(errors + "hello world");
        return res.status(400).json(errors);
      }

      const { description, email, password, username } = req.body;
      // const newUser = new User({ username, email, description, password });
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

        res.send("User Registered");
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
      // newUser
      //   .save()
      //   .then(() => res.json("User added!"))
      //   .catch((err) => res.status(400).json("Error" + err));
      // res.send("success");
    }
  );

router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/:id").delete((req, res) => {
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
