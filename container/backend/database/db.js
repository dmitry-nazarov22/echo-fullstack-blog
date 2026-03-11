require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    process.env.DB_DATABASE_URL || process.env.EXTERNAL_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initializeDatabase() {
  console.info("Initializing database");
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id          SERIAL      PRIMARY KEY,
            username    TEXT        UNIQUE          NOT NULL
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

  console.info("Tables created");
}

module.exports = {
  pool,
  initializeDatabase,
};
