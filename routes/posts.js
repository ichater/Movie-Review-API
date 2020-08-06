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

module.exports = router;
