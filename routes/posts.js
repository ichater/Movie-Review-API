const router = require("express").Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../models/profiles.model");
const User = require("../models/user.model");
const Post = require("../models/post.model");

router
  .route("/")
  .post(
    [auth, [check("text", "text is required").not().isEmpty()]],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const user = await User.findById(req.user.id).select("-password");

        const newPost = new Post({
          text: req.body.text,
          name: user.username,
          user: req.user.id,
        });

        console.log(newPost);

        const post = await newPost.save();

        res.json(post);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
      }
    }
  );

// Get all posts
// Private
router.route("/").get(auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// Get individual post by ID
// Private
router.route("/:id").get(auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(401).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("server error");
  }
});

// DELETE individual post by ID
// Private
router.route("/:id").delete(auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(401).json({ msg: "Post not found" });
    }
    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not authorized" });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("server error");
  }
});

// PUT post/like/:id
// Private
router.route("/like/:id").put(auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if post is already liked by user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("server error");
  }
});

// PUT post/unlike/:id
// Private
router.route("/unlike/:id").put(auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if post is already liked by user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    //get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("server error");
  }
});

// posts/comment/id
// comment on a post (or movie list)
router
  .route("/comment/:id")
  .post(
    [auth, [check("text", "text is required").not().isEmpty()]],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const user = await User.findById(req.user.id).select("-password");
        const post = await Post.findById(req.params.id);

        const newComment = {
          text: req.body.text,
          name: user.username,
          user: req.user.id,
        };

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
      }
    }
  );

// Delete posts/comment/:id/: comment_id
// Delete comment
// Private

router.route("/comment/:id/:comment_id").delete(auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    // pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    console.log(comment);

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "comment not found" });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
