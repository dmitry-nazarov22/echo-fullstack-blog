const express = require("express");
const usersRouter = express.Router();
const users = require("../database/users");

usersRouter.get("/", async (req, res) => {
  try {
    const result = await users.findAllUsers();
    res.send(result);
  } catch (err) {
    res.status(500).send();
  }
});

usersRouter.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await users.findUserById(id);
    res.send(user);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = usersRouter;
