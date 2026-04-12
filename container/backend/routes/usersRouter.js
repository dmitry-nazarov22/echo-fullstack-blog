const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
const users = require("../database/users");
const logger = require("../config/logger");

const { validateId, validateUser, validateBody } = require("../config/schemas");

const initializePassport = require("../config/passport-config");
const passport = require("passport");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/auth");
const { valid } = require("joi");

initializePassport(
  passport,
  async (username) => await users.findUserByUsername(username),
  async (id) => await users.findUserById(id),
);

/**
 * Endpoint to get all users from the database, to search through users.
 */
usersRouter.get("/", async (req, res) => {
  try {
    const result = await users.findAllUsers();
    res.send(result);
  } catch (err) {
    logger.error("Error while requesting all users: ", err);
    res.status(500).send(err);
  }
});

/**
 * Endpoint GET to see logged in users id to stay logged in after refreshes.
 */
usersRouter.get("/loggedin", checkAuthenticated, (req, res) => {
  res.status(200).send(req.user.id);
  logger.info("User ID: " + req.user.id + " logged in");
});

/**
 * Endpoint to get user by id.
 */
usersRouter.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // VALIDATION
  const validationRes = validateId(id);

  if (validationRes.error) {
    logger.error("Invalid ID: ", validationRes.error.message);
    return res.status(400).send(`Invalid ID: ${validationRes.error.message}`);
  }

  // OPERATION
  try {
    const user = await users.findUserById(id);
    res.send({
      id: user.id,
      username: user.username,
      description: user.description,
    });
  } catch (err) {
    logger.error("Error while requesting user by id: ", err);
    res.status(404).send(err);
  }
});

/**
 * Endpoint POST for saving user to the database.
 */
usersRouter.post("/register", checkNotAuthenticated, async (req, res) => {
  // VALIDATION
  const validationRes = validateUser(req.body);

  if (validationRes.error) {
    logger.error("Invalid user data: ", validationRes.error.message);
    return res
      .status(400)
      .send(`Invalid user data: ${validationRes.error.message}`);
  }

  // OPERATION
  try {
    const username = req.body.username;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await users.saveUser({ username, password: hashedPassword });
    logger.info("New user registered: ", user);
    res.status(201).send(user);
  } catch (err) {
    logger.error("Error while trying to register a new user: ", err);
    res.status(500).send(err);
  }
});

/**
 * Endpoint POST for logging user in to the database.
 */
usersRouter.post("/login", checkNotAuthenticated, async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      logger.error("Error while logging in: ", err);
      return res.status(500).send({ message: err.message });
    }

    if (!user) {
      logger.error("Login error: ", err);
      return res.status(401).send({ message: info.message });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        logger.error("Login error: ", err);
        return res.status(500).send({ message: loginErr.message });
      }

      return res.status(200).send({
        message: "Login successful",
        user: { id: user.id, username: user.username },
      });
    });
  })(req, res, next);
});

/**
 * Endpoint DELETE to log out user.
 */
usersRouter.delete("/logout", checkAuthenticated, (req, res) => {
  req.logOut((err) => {
    if (err) {
      logger.error("Error while logging out: ", err);
      return res.status(500).send({ message: "Logout failed." });
    }
    res.status(200).send({ message: "Logged out succesfully." });
  });
});

usersRouter.patch("/description", checkAuthenticated, async (req, res) => {
  // VALIDATION
  const validationRes = validateBody(req.body.description);

  if (validationRes.error) {
    logger.error("Invalid description: ", validationRes.error.message);
    return res
      .status(400)
      .send(`Invalid description: ${validationRes.error.message}`);
  }

  // OPERATION
  try {
    const updatedUser = await users.editDescription({
      id: req.user.id,
      description: req.body.description,
    });
    res
      .status(200)
      .send({
        id: updatedUser.id,
        username: updatedUser.username,
        description: updatedUser.description,
      });
  } catch {
    logger.error("Error while editing a description: ", err);
    res.status(500).send(err);
  }
});

module.exports = usersRouter;
