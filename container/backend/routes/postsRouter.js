const express = require("express");
const postsRouter = express.Router();
const posts = require("../database/posts");

postsRouter.get("/", async (req, res) => {
  try {
    const result = await posts.findAllPosts();
    res.send(result);
  } catch (err) {
    res.status(500).send();
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

module.exports = postsRouter;
