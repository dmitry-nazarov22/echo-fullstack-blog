require("dotenv").config();
const express = require("express");
const db = require("./database/db");
const usersRouter = require("./routes/usersRouter");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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

    await db.pool.end();
    server.close(() => {
      console.info("HTTP server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown); // system manager, some other application
  process.on("SIGINT", shutdown); // ctrl-c
};

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.use("/", usersRouter);

connectToDatabaseAndStartServer();
