const express = require("express");
const commentsRouter = express.Router();
const comments = require("../database/comments");

module.exports = commentsRouter;
