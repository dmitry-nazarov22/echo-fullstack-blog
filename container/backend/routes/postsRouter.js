const express = require("express");
const postsRouter = express.Router();
const posts = require("../database/posts");

postsRouter.get("/", async (req, res) => {
  try {
    const result = await posts.findAllPosts();
    console.log(result);
    res.send(result);
  } catch (err) {
    res.status(500).send();
  }
});

postsRouter.get("/:userId", async (req, res) => {
  try {
    const id = parseInt(req.params.userId);
    const posts = await posts.findPostsByUserId(id);
    res.send(posts);
  } catch (err) {
    res.status(404).send(err);
  }
});

postsRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const post = await posts.deletePostById(id);
    res.status(204).send();
  } catch (err) {
    res.status(404).send(err);
  }
});

postsRouter.post("/", async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const body = req.body.body;

    const post = await posts.savePost({ user_id, body });
    res.status(201).send(post);
  } catch (err) {
    res.status(500).send();
  }
});

postsRouter.patch("/:id", async (req, res) => {
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
