const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
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

/**
 * Endpoint POST for saving user to the database.
 */
usersRouter.post("/register", async (req, res) => {
  try {
    const username = req.body.username;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await users.saveUser({ username, password: hashedPassword });
    res.status(201).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = usersRouter;
