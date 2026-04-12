const express = require("express");
const likesRouter = express.Router();
const likes = require("../database/likes");
const logger = require("../config/logger");
const { checkAuthenticated } = require("../middleware/auth");
const { validateId } = require("../config/schemas");

/**
 * Endpoint GET for finding likes by user ID to show them in profile.
 */
likesRouter.get("/user/:userId", async (req, res) => {
  const id = parseInt(req.params.userId);

  // VALIDATION
  const validationRes = validateId(id);

  if (validationRes.error) {
    logger.error(`Invalid user ID: ${validationRes.error.message}`);
    return res
      .status(400)
      .send(`Invalid user ID: ${validationRes.error.message}`);
  }

  // OPERATION
  try {
    const userLikes = await likes.findLikesByUserId(id);
    res.send(userLikes);
  } catch (err) {
    logger.error(`Error while requesting for likes: ${err.message}`);
    res.status(404).send(err);
  }
});

/**
 * Endpoint GET to get likes count on Posts to show amount of likes near the button.
 */
likesRouter.get("/post/:postId", async (req, res) => {
  const id = parseInt(req.params.postId);

  // VALIDATION
  const validationRes = validateId(id);

  if (validationRes.error) {
    logger.error(`Invalid post ID: ${validationRes.error.message}`);
    return res
      .status(400)
      .send(`Invalid post ID: ${validationRes.error.message}`);
  }

  // OPERATION
  try {
    const postLikesCount = await likes.countLikesByPostId(id);
    res.send(postLikesCount);
  } catch (err) {
    logger.error(`Error while requesting likes count: ${err.message}`);
    res.status(404).send(err);
  }
});

/**
 * Endpoint GET to find if user has liked the post.
 */
likesRouter.get("/post/:post_id/user/:user_id", async (req, res) => {
  const post_id = parseInt(req.params.post_id);
  const user_id = parseInt(req.params.user_id);

  // VALIDATION
  const validationResPost = validateId(post_id);
  const validationResUser = validateId(user_id);

  if (validationResPost.error) {
    logger.error(`Invalid post ID: ${validationResPost.error.message}`);
    return res
      .status(400)
      .send(`Invalid post ID: ${validationResPost.error.message}`);
  }
  if (validationResUser.error) {
    logger.error(`Invalid user ID: ${validationResUser.error.message}`);
    return res
      .status(400)
      .send(`Invalid user ID: ${validationResUser.error.message}`);
  }

  // OPERATION
  try {
    const isPostLiked = await likes.isPostLikedByUserId(post_id, user_id);
    res.send(isPostLiked);
  } catch (err) {
    logger.error(`Error while requesting like-status: ${err.message}`);
    res.status(404).send(err);
  }
});

/**
 * Endpoint DELETE to delete like by user_id and post_id together from the database.
 */
likesRouter.delete("/post/:post_id/", checkAuthenticated, async (req, res) => {
  const post_id = parseInt(req.params.post_id);

  // VALIDATION
  const validationResPost = validateId(post_id);

  if (validationResPost.error) {
    logger.error(`Invalid post ID: ${validationResPost.error.message}`);
    return res
      .status(400)
      .send(`Invalid post ID: ${validationResPost.error.message}`);
  }

  // OPERATION
  try {
    const post_id = parseInt(req.params.post_id);
    const user_id = parseInt(req.user.id);

    await likes.deleteLikeById({ post_id, user_id });
    res.status(204).send();
  } catch (err) {
    logger.error(`Error while deleting a like: ${err.message}`);
    res.status(404).send(err);
  }
});

/**
 * Endpoint POST to save like to the database.
 */
likesRouter.post("/", checkAuthenticated, async (req, res) => {
  const post_id = parseInt(req.body.post_id);

  // VALIDATION
  const validationResPost = validateId(post_id);

  if (validationResPost.error) {
    logger.error(`Invalid post ID: ${validationResPost.error.message}`);
    return res
      .status(400)
      .send(`Invalid post ID: ${validationResPost.error.message}`);
  }

  // OPERATION
  try {
    const user_id = req.user.id;

    const like = await likes.saveLike({ post_id, user_id });
    res.status(201).send(like);
  } catch (err) {
    logger.error(`Error while saving a like: ${err.message}`);
    res.status(500).send(err);
  }
});

module.exports = likesRouter;
