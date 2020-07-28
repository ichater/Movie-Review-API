const router = require("express").Router();
let MovieList = require("../models/movielist.model");

// ,,,.com/users/movieLists/userId

//get specific list
router.route("/:listId").get((req, res) => {
  MovieList.findById(req.params.listId)
    .then((movieList) => res.json(movieList))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/").post((req, res) => {
  const { userId, movieList, movieListTitle } = req.body;
  const newList = new MovieList({ userId, movieList, movieListTitle });
  newList
    .save()
    .then(() => res.json("MovieList added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// router.route("/:listId").put((req, res) => {
//   // const userId = req.params.userId;
//   const listId = req.params.listId;
//   //find one where id === someId
//   MovieList.findByIdAndUpdate(req.params.listId, ???);
// });

router.route("/:listId").delete((req, res) => {
  MovieList.findById(req.params.listId)
    .then((list) =>
      list
        .remove()
        .then(() => res.json({ success: true } + "movielist deleted"))
    )
    .catch((err) => res.status(400).json("Error" + err));
});

module.exports = router;
