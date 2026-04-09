const express = require("express");
const commentsRouter = express.Router();
const comments = require("../database/comments");
const logger = require("../config/logger");
const { checkAuthenticated } = require("../middleware/auth");

/**
 * Endpoint GET to find comments by user ID to show them in profile.
 */
commentsRouter.get("/user/:userId", async (req, res) => {
  try {
    const id = parseInt(req.params.userId);
    const userComments = await comments.findCommentsByUserId(id);
    res.send(userComments);
  } catch (err) {
    logger.error("Error while fetching comments by user id: ", err);
    res.status(404).send(err);
  }
});

/**
 * Endpoint GET to find comments by post ID to show them under individual post.
 */
commentsRouter.get("/post/:postId", async (req, res) => {
  try {
    const id = parseInt(req.params.postId);
    const postComments = await comments.findCommentsByPostId(id);
    res.send(postComments);
  } catch (err) {
    logger.error("Error while fetching comments by post id: ", err);
    res.status(404).send(err);
  }
});

/**
 * Endpoint GET to find the latest comment for post to showcase it in the feed.
 */
commentsRouter.get("/post/first/:postId", async (req, res) => {
  try {
    const id = parseInt(req.params.postId);
    const firstComment = await comments.findFirstCommentByPostId(id);
    res.send(firstComment);
  } catch (err) {
    logger.error("Error while fetching latest comment by post id: ", err);
    res.status(404).send(err);
  }
});

/**
 * Endpoint DELETE to delete comment from the database.
 */
commentsRouter.delete("/:id", checkAuthenticated, async (req, res) => {
  const id = parseInt(req.params.id);
  const user_id = req.user.id;
  try {
    await comments.deleteCommentById(id, user_id);
    res.status(204).send();
  } catch (err) {
    logger.error("Error deleting a comment: ", err);
    res.status(404).send(err);
  }
});

/**
 * Endpoint POST to save comment to the database.
 */
commentsRouter.post("/", checkAuthenticated, async (req, res) => {
  try {
    const post_id = req.body.post_id;
    const user_id = req.user.id;
    const body = req.body.body;

    const comment = await comments.saveComment({ post_id, user_id, body });
    res.status(201).send(comment);
  } catch (err) {
    logger.error("Error while saving comment: ", err);
    res.status(500).send(err);
  }
});

/**
 * Endpoint PATCH to edit comments by ID.
 */
commentsRouter.patch("/:id", checkAuthenticated, async (req, res) => {
  const id = req.params.id;
  const user_id = req.user.id;
  const body = req.body.body;

  try {
    const updatedComment = await comments.editCommentById(id, user_id, body);
    res.json(updatedComment);
  } catch (err) {
    logger.error("Error while editing a comment: ", err);
    res.status(500).send(err);
  }
});

module.exports = commentsRouter;
