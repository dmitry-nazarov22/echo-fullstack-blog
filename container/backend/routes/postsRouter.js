const express = require("express");
const postsRouter = express.Router();
const posts = require("../database/posts");

postsRouter.get("/api/posts", async (req, res) => {
  try {
    const result = await posts.findAllPosts();
    res.send(result);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = postsRouter;
