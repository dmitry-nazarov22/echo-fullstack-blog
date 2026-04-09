const express = require("express");
const likesRouter = express.Router();
const likes = require("../database/likes");
const { checkAuthenticated } = require("../middleware/auth");

/**
 * Endpoint GET for finding likes by user ID to show them in profile.
 */
likesRouter.get("/user/:userId", async (req, res) => {
  try {
    const id = parseInt(req.params.userId);
    const userLikes = await likes.findLikesByUserId(id);
    res.send(userLikes);
  } catch (err) {
    res.status(404).send(err);
  }
});

/**
 * Endpoint GET to get likes count on Posts to show amount of likes near the button.
 */
likesRouter.get("/post/:postId", async (req, res) => {
  try {
    const id = parseInt(req.params.postId);
    const postLikesCount = await likes.countLikesByPostId(id);
    res.send(postLikesCount);
  } catch (err) {
    res.status(404).send(err);
  }
});

/**
 * Endpoint GET to find if user has liked the post.
 */
likesRouter.get("/post/:post_id/user/:user_id", async (req, res) => {
  try {
    const post_id = parseInt(req.params.post_id);
    const user_id = parseInt(req.params.user_id);
    const isPostLiked = await likes.isPostLikedByUserId(post_id, user_id);
    res.send(isPostLiked);
  } catch (err) {
    res.status(404).send(err);
  }
});

/**
 * Endpoint DELETE to delete like by user_id and post_id together from the database.
 */
likesRouter.delete("/post/:post_id/", checkAuthenticated, async (req, res) => {
  try {
    const post_id = parseInt(req.params.post_id);
    const user_id = parseInt(req.user.id);

    await likes.deleteLikeById({ post_id, user_id });
    res.status(204).send();
  } catch (err) {
    res.status(404).send(err);
  }
});

/**
 * Endpoint POST to save like to the database.
 */
likesRouter.post("/", checkAuthenticated, async (req, res) => {
  try {
    const post_id = req.body.post_id;
    const user_id = req.user.id;

    const like = await likes.saveLike({ post_id, user_id });
    res.status(201).send(like);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = likesRouter;
