const express = require("express");
const commentsRouter = express.Router();
const comments = require("../database/comments");

commentsRouter.get("/user/:userId", async (req, res) => {
  try {
    const id = parseInt(req.params.userId);
    const userComments = await comments.findCommentsByUserId(id);
    res.send(userComments);
  } catch (err) {
    res.status(404).send(err);
  }
});

commentsRouter.get("/post/:postId", async (req, res) => {
  try {
    const id = parseInt(req.params.postId);
    const postComments = await comments.findCommentsByPostId(id);
    res.send(postComments);
  } catch (err) {
    res.status(404).send(err);
  }
});

commentsRouter.get("/post/first/:postId", async (req, res) => {
  try {
    const id = parseInt(req.params.postId);
    const firstComment = await comments.findFirstCommentByPostId(id);
    res.send(firstComment);
  } catch (err) {
    res.status(404).send(err);
  }
});

commentsRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const comments = await comments.deleteCommentById(id);
    res.status(204).send();
  } catch (err) {
    res.status(404).send(err);
  }
});

commentsRouter.post("/", async (req, res) => {
  try {
    const post_id = req.body.post_id;
    const user_id = req.body.user_id;
    const body = req.body.body;

    const comment = await comments.saveComment({ post_id, user_id, body });
    res.status(201).send(comment);
  } catch (err) {
    res.status(500).send();
  }
});

commentsRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body.body;

  try {
    const updatedComment = await comments.edit(id, body);
    res.json(updatedComment);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = commentsRouter;
