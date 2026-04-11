const express = require("express");
const postsRouter = express.Router();
const Joi = require("joi");
const posts = require("../database/posts");
const logger = require("../config/logger");

const {
  checkAuthenticated,
  checkAuthenticationForUD,
} = require("../middleware/auth");

const idSchema = Joi.object({
  id: Joi.number().min(0),
});

/**
 * Endpoint to get all posts to display them in the feed.
 */
postsRouter.get("/", async (req, res) => {
  try {
    const result = await posts.findAllPosts();
    res.send(result);
  } catch (err) {
    logger.error("Error while requesting all posts: ", err);
    res.status(500).send(err);
  }
});

/**
 * Endpoint for getting posts by user ID to display them in profile.
 */
postsRouter.get("/:userId", async (req, res) => {
  // VALIDATION
  const validationRes = idSchema.validate(req.params.userId);

  if (validationRes.error) {
    logger.error("Invalid user ID: ", validationRes.error.message);
    return res
      .status(400)
      .send(`Invalid user ID: ${validationRes.error.message}`);
  }

  // OPERATION
  try {
    const id = parseInt(req.params.userId);
    const userPosts = await posts.findPostsByUserId(id);
    res.send(userPosts);
  } catch (err) {
    logger.error("Error while requesting all posts by user ID: ", err);
    res.status(404).send(err);
  }
});

/**
 * Endpoint for DELETE post by id from the database.
 */
postsRouter.delete("/:id", checkAuthenticationForUD, async (req, res) => {
  // VALIDATION
  const validationRes = idSchema.validate(req.params.id);

  if (validationRes.error) {
    logger.error("Invalid post ID: ", validationRes.error.message);
    return res
      .status(400)
      .send(`Invalid post ID: ${validationRes.error.message}`);
  }

  // OPERATION
  const id = parseInt(req.params.id);
  try {
    const post = await posts.deletePostById(id);
    res.status(204).send();
  } catch (err) {
    logger.error("Error while deleting a post: ", err);
    res.status(404).send(err);
  }
});

/**
 * Endpoint POST for saving post by id to the database.
 */
postsRouter.post("/", checkAuthenticated, async (req, res) => {
  try {
    const user_id = req.user.id;
    const body = req.body.body;

    const post = await posts.savePost({ user_id, body });
    res.status(201).send(post);
  } catch (err) {
    logger.error("Error while saving a post: ", err);
    res.status(500).send(err);
  }
});

/**
 * Endpoint PATCH to edit post by id in the database
 */
postsRouter.patch("/:id", checkAuthenticationForUD, async (req, res) => {
  // VALIDATION
  const validationRes = idSchema.validate(req.params.id);

  if (validationRes.error) {
    logger.error("Invalid post ID: ", validationRes.error.message);
    return res
      .status(400)
      .send(`Invalid post ID: ${validationRes.error.message}`);
  }

  // OPERATION
  const id = req.params.id;
  const body = req.body.body;

  try {
    const updatedPost = await posts.edit(id, body);
    res.json(updatedPost);
  } catch (err) {
    logger.error("Error while editing a post: ", err);
    res.status(500).send(err);
  }
});

module.exports = postsRouter;
