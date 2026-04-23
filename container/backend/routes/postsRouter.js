const express = require("express");
const postsRouter = express.Router();
const posts = require("../database/posts");
const logger = require("../config/logger");
const { validateId, validateBody } = require("../config/schemas");

const {
  checkAuthenticated,
  checkAuthenticationForUD,
} = require("../middleware/auth");

/**
 * Endpoint to get all posts to display them in the feed.
 */
postsRouter.get("/", async (req, res) => {
  try {
    const result = await posts.findAllPosts();
    res.send(result);
  } catch (err) {
    logger.error(`Error while requesting all posts: ${err.message}`);
    res.status(500).send(err);
  }
});

/**
 * Endpoint for getting posts by user ID to display them in profile.
 */
postsRouter.get("/:userId", async (req, res) => {
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
    const userPosts = await posts.findPostsByUserId(id);
    res.send(userPosts);
  } catch (err) {
    logger.error(`Error while requesting all posts by user ID: ${err.message}`);
    res.status(500).send(err);
  }
});

/**
 * Endpoint for DELETE post by id from the database.
 */
postsRouter.delete("/:id", checkAuthenticationForUD, async (req, res) => {
  const id = parseInt(req.params.id);

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
    const post = await posts.deletePostById(id);
    res.status(204).send();
  } catch (err) {
    logger.error(`Error while deleting a post: ${err.message}`);
    res.status(404).send(err);
  }
});

/**
 * Endpoint POST for saving post by id to the database.
 */
postsRouter.post("/", checkAuthenticated, async (req, res) => {
  // VALIDATION
  const validationRes = validateBody(req.body.body);

  if (validationRes.error) {
    logger.error(`Invalid post body: ${validationRes.error.message}`);
    return res
      .status(400)
      .send(`Invalid post body: ${validationRes.error.message}`);
  }

  // OPERATION
  try {
    const user_id = req.user.id;
    const body = req.body.body;

    const post = await posts.savePost({ user_id, body });
    res.status(201).send(post);
  } catch (err) {
    logger.error(`Error while saving a post: ${err.message}`);
    res.status(500).send(err);
  }
});

/**
 * Endpoint PATCH to edit post by id in the database
 */
postsRouter.patch("/:id", checkAuthenticationForUD, async (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body.body;

  // VALIDATION
  const validationResId = validateId(id);
  if (validationResId.error) {
    logger.error(`Invalid post ID: ${validationResId.error.message}`);
    return res
      .status(400)
      .send(`Invalid post ID: ${validationResId.error.message}`);
  }

  const validationResBody = validateBody(body);

  if (validationResBody.error) {
    logger.error(`Invalid post body: ${validationResBody.error.message}`);
    return res
      .status(400)
      .send(`Invalid post body: ${validationResBody.error.message}`);
  }

  // OPERATION

  try {
    const updatedPost = await posts.edit(id, body);
    res.status(200).send(updatedPost);
  } catch (err) {
    logger.error(`Error while editing a post: ${err.message}`);
    res.status(500).send(err);
  }
});

module.exports = postsRouter;
