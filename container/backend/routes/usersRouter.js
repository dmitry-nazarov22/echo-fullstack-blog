const express = require("express");
const usersRouter = express.Router();
const users = require("../database/users");

usersRouter.get("/api/users", async (req, res) => {
  try {
    const result = await users.findAllUsers();
    res.send(result);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = usersRouter;
