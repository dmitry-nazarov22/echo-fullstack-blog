require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.EXTERNAL_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function insertData() {
  try {
    console.info("Inserting data...");
    // Insert data, the ? placeholders prevent SQL injection
    await pool.query("INSERT INTO users (username) VALUES ($1)", [
      "dimanazarov",
    ]);
    await pool.query("INSERT INTO users (username) VALUES ($1)", ["user1"]);
    await pool.query("INSERT INTO users (username) VALUES ($1)", ["user2"]);
    await pool.query("INSERT INTO users (username) VALUES ($1)", [
      "randomname123",
    ]);
  } catch (err) {
    console.err("Error inserting data");
    console.err(err);
  } finally {
    await pool.end();
    console.info("Data inserted");
  }
}

async function removeData() {
  try {
    console.info("Removing data...");

    await pool.query("DELETE FROM likes");
    await pool.query("DELETE FROM comments");
    await pool.query("DELETE FROM posts");
    await pool.query("DELETE FROM users");
  } catch (err) {
    console.error("Error removing data");
    console.error(err);
  } finally {
    await pool.end();
    console.info("Data removed");
  }
}

insertData();
// removeData();
