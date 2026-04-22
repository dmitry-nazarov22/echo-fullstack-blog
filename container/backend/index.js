require("dotenv").config();
const app = require("./app");
const db = require("./database/db");
const logger = require("./config/logger");

const port = process.env.PORT || 3000;

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

connectToDatabaseAndStartServer();
