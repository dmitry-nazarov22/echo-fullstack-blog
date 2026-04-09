require("dotenv").config();
const logger = require("../config/logger");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    // DB_DATABASE_URL in prod || EXTERNAL_DATABASE_URL from local .env for dev
    process.env.DB_DATABASE_URL || process.env.EXTERNAL_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/**
 * Initializes the database.
 *
 * Creates all tables with needed columns if they do not exist while starting the server.
 */
async function initializeDatabase() {
  try {
    logger.info("Initializing database...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id          SERIAL      PRIMARY KEY,
          username    TEXT        UNIQUE          NOT NULL,
          password    TEXT        NOT NULL,
          description TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
          id          SERIAL      PRIMARY KEY,
          user_id     INTEGER     REFERENCES users(id),
          body        TEXT        NOT NULL,
          created_at  TIMESTAMP   DEFAULT     CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
          id          SERIAL      PRIMARY KEY,
          post_id     INTEGER     REFERENCES  posts(id),
          user_id     INTEGER     REFERENCES  users(id),
          body        TEXT        NOT NULL,
          created_at  TIMESTAMP   DEFAULT     CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS likes (
          post_id     INTEGER     REFERENCES  posts(id),
          user_id     INTEGER     REFERENCES  users(id),

          PRIMARY KEY (post_id, user_id)
      );
    `);

    logger.info("Database available!");
  } catch (err) {
    logger.error("Error while initializing database:" + err);
  }
}

module.exports = {
  pool,
  initializeDatabase,
};
