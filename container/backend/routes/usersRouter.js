const express = require("express");
const usersRouter = express.Router();
const users = require("../database/users");

/**
 * Endpoint to get all users from the database, to search through users.
 */
usersRouter.get("/", async (req, res) => {
  try {
    const result = await users.findAllUsers();
    res.send(result);
  } catch (err) {
    res.status(500).send();
  }
});

/**
 * Endpoint to get user by id. No use cases yet. Made for testing.
 */
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
