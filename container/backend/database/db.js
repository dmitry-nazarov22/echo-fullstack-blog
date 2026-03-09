require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
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

  // await insertData();
}

async function insertData() {
  // Insert data, the ? placeholders prevent SQL injection
  pool.query("INSERT INTO users (username) VALUES ($1)", ["dimanazarov"]);
  pool.query("INSERT INTO users (username) VALUES ($1)", ["user1"]);
  pool.query("INSERT INTO users (username) VALUES ($1)", ["user2"]);
  pool.query("INSERT INTO users (username) VALUES ($1)", ["randomname123"]);
}

module.exports = {
  pool,
  initializeDatabase,
};
