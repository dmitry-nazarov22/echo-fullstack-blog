const express = require("express");
const likesRouter = express.Router();
const likes = require("../database/likes");

likesRouter.get("/user/:userId", async (req, res) => {
  try {
    const id = parseInt(req.params.userId);
    const userLikes = await likes.findLikesByUserId(id);
    res.send(userLikes);
  } catch (err) {
    res.status(404).send(err);
  }
});

likesRouter.get("/post/:postId", async (req, res) => {
  try {
    const id = parseInt(req.params.postId);
    const postLikesCount = await likes.countLikesByPostId(id);
    res.send(postLikesCount);
  } catch (err) {
    res.status(404).send(err);
  }
});

likesRouter.delete("/post/:post_id/user/:user_id", async (req, res) => {
  try {
    const post_id = parseInt(req.params.post_id);
    const user_id = parseInt(req.params.user_id);

    await likes.deleteLikeById({ post_id, user_id, body });
    res.status(204).send();
  } catch (err) {
    res.status(404).send(err);
  }
});

likesRouter.post("/", async (req, res) => {
  try {
    const post_id = req.body.post_id;
    const user_id = req.body.user_id;

    const like = await like.saveLike({ post_id, user_id });
    res.status(201).send(like);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = likesRouter;
