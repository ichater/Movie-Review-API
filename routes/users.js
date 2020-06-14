const router = require("express").Router();
let User = require("../models/user.model");

//How we access the user
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/register").post((req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const newUser = new User({ username, email });

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

      user
        .save()
        .then(() => res.json("Exercise updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
