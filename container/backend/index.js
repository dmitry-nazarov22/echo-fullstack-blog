require("dotenv").config();
const express = require("express");
const db = require("./database/db");
const logger = require("./logger");
const usersRouter = require("./routes/usersRouter");
const postsRouter = require("./routes/postsRouter");
const commentsRouter = require("./routes/commentsRouter");
const likesRouter = require("./routes/likesRouter");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

const connectToDatabaseAndStartServer = async () => {
  await db.initializeDatabase();

  const server = app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });

  setupGracefulShutdown(server);
};

const setupGracefulShutdown = (server) => {
  const shutdown = async () => {
    logger.info("Shutting down gracefully...");

    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });

    await db.pool.end();
    logger.info("Database connection closed.");
  };

  process.on("SIGTERM", shutdown); // system manager, some other application
  process.on("SIGINT", shutdown); // ctrl-c
};

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/likes", likesRouter);

connectToDatabaseAndStartServer();
