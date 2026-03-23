require("dotenv").config();
const express = require("express");
const db = require("./database/db");
const usersRouter = require("./routes/usersRouter");
const postsRouter = require("./routes/postsRouter");
const commentsRouter = require("./routes/commentsRouter");
const likesRouter = require("./routes/likesRouter");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const connectToDatabaseAndStartServer = async () => {
  await db.initializeDatabase();

  const server = app.listen(port, () => {
    console.info(`Server is running on port ${port}`);
  });

  setupGracefulShutdown(server);
};

const setupGracefulShutdown = (server) => {
  const shutdown = async () => {
    console.info("Shutting down gracefully...");

    server.close(() => {
      console.info("HTTP server closed");
      process.exit(0);
    });

    await db.pool.end();
    console.info("Database connection closed.");
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
