const router = require("express").Router();
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

router.route("/register").post((req, res) => {
  const username = req.body.list;
  const email = req.body.email;
  const description = req.body.description;
  const newUser = new User({ username, email, description });
  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

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
