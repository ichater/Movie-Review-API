const router = require("express").Router();
let MovieList = require("../models/movielist.model");

// ,,,.com/users/movieLists/userId

//get all lists
router.route("/").get((req, res) => {
  MovieList.find()
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

router.route("/:listId").get((req, res) => {
  MovieList.findById(req.params.listId)
    .then((movieList) => res.json(movieList))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/:listId").put((req, res) => {
  const { year, title } = req.body;
  const movie = { year, title };
  MovieList.updateOne(req.params.listId)
    .then((movieList) =>
      movieList
        .update()
        .then(() => res.json({ success: true } + "movielist updated"))
    )
    .catch((err) => res.status(400).json("Error" + err));
});

// router.route("/:listId").post((req, res) => {
//   MovieList.findById(req.params.listId)
//     .then((movieList) => {
//       movieList.title = req.body.title;
//       movieList.year = req.body.year;
//       movieList
//         .save()
//         .then(() => res.json("movie list updated!"))
//         .catch((err) => res.status(400).json("Error: " + err));
//     })
//     .catch((err) => res.status(400).json("Error: " + err));
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
