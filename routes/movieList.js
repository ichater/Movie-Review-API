const router = require("express").Router();
let MovieList = require("../models/movielist.model");

router.route("/:userId").get((req, res) => {
  MovieList.find({ user: req.params.userId })
    .then((movieList) => res.json(movieList))
    .catch((err) => res.status(400).json("Error" + err));
});

//get specific list
router.route("/:userId/:id").get((req, res) => {
  MovieList.findById({ "list.id": "<id>" })
    .then((movieList) => res.json(movieList))
    .catch((err) => res.status(400).json("Error" + err));
});

// POST www.izaksapp/movielist/
router.route("/").post((req, res) => {
  const userId = req.body.userId;
  const movies = req.body.movies;
  const movieList = new MovieList({ user: userId, list: movies });
  movieList
    .save()
    .then(() => res.json("MovieList added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:userId/:id").put((req, res) => {
  //find one where id === someId
  MovieList.findOneAndUpdate(
    {
      id: req.params.id,
    },
    req.newData,
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send("Succesfully saved.");
    }
  );
});

router.route("/:id").delete((req, res) => {
  MovieList.findById(req.params.id)
    .then((list) => list.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(400).json("Error" + err));
});

module.exports = router;
