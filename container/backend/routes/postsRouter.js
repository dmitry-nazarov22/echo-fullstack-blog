const express = require("express");
const postsRouter = express.Router();
const posts = require("../database/posts");

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
    console.log(result);
    res.send(result);
  } catch (err) {
    res.status(500).send();
  }
});

/**
 * Endpoint for getting posts by user ID to display them in profile.
 */
postsRouter.get("/:userId", async (req, res) => {
  try {
    const id = parseInt(req.params.userId);
    const userPosts = await posts.findPostsByUserId(id);
    res.send(userPosts);
  } catch (err) {
    res.status(404).send(err);
  }
});

/**
 * Endpoint for DELETE post by id from the database.
 */
postsRouter.delete("/:id", checkAuthenticationForUD, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const post = await posts.deletePostById(id);
    res.status(204).send();
  } catch (err) {
    res.status(404).send(err);
  }
});

/**
 * Endpoint POST for saving post by id to the database.
 */
postsRouter.post("/", checkAuthenticated, async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const body = req.body.body;

    const post = await posts.savePost({ user_id, body });
    res.status(201).send(post);
  } catch (err) {
    res.status(500).send();
  }
});

/**
 * Endpoint PATCH to edit post by id in the database
 */
postsRouter.patch("/:id", checkAuthenticationForUD, async (req, res) => {
  const id = req.params.id;
  const body = req.body.body;

  try {
    const updatedPost = await posts.edit(id, body);
    res.json(updatedPost);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = postsRouter;
