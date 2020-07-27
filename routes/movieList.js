const router = require("express").Router();
let MovieList = require("../models/movielist.model");

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

// GET www.. /movieList/:routeParam?someQueryParam=x

router.route("/:userId").post((req, res) => {
  MovieList.findOneAndUpdate(query, req.newData, { upsert: true }, function (
    err,
    doc
  ) {
    if (err) return res.send(500, { error: err });
    return res.send("Succesfully saved.");
  });
});

router.route("/:userId").get((req, res) => {
  MovieList.find({ user: req.params.userId })
    .then((movieList) => res.json(movieList))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/:userId").delete((req, res) => {
  MovieList.findByIdAndDelete(req.params.userId)
    .then(() => res.json("MovieList Deleted"))
    .catch((err) => res.status(400).json("Error" + err));
});

module.exports = router;
