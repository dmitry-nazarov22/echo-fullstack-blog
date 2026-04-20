require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

// Only external database url here, because this is supposed to be used only locally.
// Render.com Postgres server is temporary in free subscription, so this file is used to either
// insert users to the tables or remove all of it.
// Won't be needed in prod.

const pool = new Pool({
  connectionString: process.env.EXTERNAL_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/**
 * Insert data to the database.
 *
 * Supposed to be used while making the project, because Render.com Postgres server is temporary
 * in free plan. Used to populate the tables. This includes blueprint users, posts, comments, and likes.
 */
async function insertData() {
  try {
    console.info("Inserting data...");

    // Hash passwords
    const dimaPassword = await bcrypt.hash("12345678", 10);
    const anotheruserPassword = await bcrypt.hash("anotheruser", 10);
    const guiderPassword = await bcrypt.hash("guider", 10);

    // Insert users
    console.info("Inserting users...");
    const userResult = await pool.query(
      `INSERT INTO users (username, password, description) VALUES
       ($1, $2, $3),
       ($4, $5, $6),
       ($7, $8, $9)
       RETURNING id, username`,
      [
        "dima.nazarov",
        dimaPassword,
        "description will be visible after editing it once. it can also be empty",
        "anotheruser",
        anotheruserPassword,
        "",
        "guider",
        guiderPassword,
        "making useful posts to help you understand this app",
      ],
    );

    const users = userResult.rows;
    const userMap = {};
    users.forEach((user) => {
      userMap[user.username] = user.id;
    });

    console.info("Users inserted:", JSON.stringify(userMap));

    // Insert posts
    console.info("Inserting posts...");
    const postResult = await pool.query(
      `INSERT INTO posts (user_id, body, created_at) VALUES
       ($1, $2, $3),
       ($4, $5, $6),
       ($7, $8, $9),
       ($10, $11, $12),
       ($13, $14, $15),
       ($16, $17, $18)
       RETURNING id, user_id, body`,
      [
        userMap["dima.nazarov"],
        "i added profile descriptions!",
        "2026-04-12T08:48:42.457Z",
        userMap["dima.nazarov"],
        "multiple user support is added :O",
        "2026-04-09T15:38:30.716Z",
        userMap["guider"],
        "latest comment will be visible as a highlight",
        "2026-04-09T15:35:12.406Z",
        userMap["anotheruser"],
        "posts can be edited... EDIT: and deleted",
        "2026-04-09T15:32:27.361Z",
        userMap["dima.nazarov"],
        "it works!!",
        "2026-04-09T15:25:46.804Z",
        userMap["dima.nazarov"],
        "hey, this is the first post!!!",
        "2026-04-09T15:25:24.784Z",
      ],
    );

    const posts = postResult.rows;
    const postMap = {};
    posts.forEach((post) => {
      postMap[post.body] = post.id;
    });

    console.info("Posts inserted");

    // Insert comments
    console.info("Inserting comments...");
    const guiderPost = postMap["latest comment will be visible as a highlight"];
    const itWorksPost = postMap["it works!!"];

    await pool.query(
      `INSERT INTO comments (post_id, user_id, body, created_at) VALUES
       ($1, $2, $3, $4),
       ($5, $6, $7, $8),
       ($9, $10, $11, $12),
       ($13, $14, $15, $16)`,
      [
        guiderPost,
        userMap["guider"],
        "and now you can read all the comments!",
        "2026-04-09T15:35:51.221Z",
        guiderPost,
        userMap["anotheruser"],
        "how cool is that!",
        "2026-04-09T15:36:32.246Z",
        guiderPost,
        userMap["guider"],
        "by clicking on a post you can expand it fully and read all comments!",
        "2026-04-09T15:37:38.475Z",
        itWorksPost,
        userMap["dima.nazarov"],
        "comments and likes too :)",
        "2026-04-09T15:28:30.401Z",
      ],
    );

    console.info("Comments inserted");

    // Insert likes
    console.info("Inserting likes...");
    await pool.query(
      `INSERT INTO likes (post_id, user_id) VALUES
       ($1, $2),
       ($3, $4),
       ($5, $6),
       ($7, $8),
       ($9, $10),
       ($11, $12),
       ($13, $14),
       ($15, $16),
       ($17, $18),
       ($19, $20)`,
      [
        postMap["i added profile descriptions!"],
        userMap["dima.nazarov"],
        postMap["i added profile descriptions!"],
        userMap["anotheruser"],
        postMap["multiple user support is added :O"],
        userMap["dima.nazarov"],
        postMap["multiple user support is added :O"],
        userMap["anotheruser"],
        postMap["latest comment will be visible as a highlight"],
        userMap["dima.nazarov"],
        postMap["latest comment will be visible as a highlight"],
        userMap["anotheruser"],
        postMap["latest comment will be visible as a highlight"],
        userMap["guider"],
        postMap["posts can be edited... EDIT: and deleted"],
        userMap["dima.nazarov"],
        postMap["hey, this is the first post!!!"],
        userMap["dima.nazarov"],
        postMap["hey, this is the first post!!!"],
        userMap["anotheruser"],
        postMap["hey, this is the first post!!!"],
        userMap["guider"],
      ],
    );

    console.info("Likes inserted");
    console.info("All data inserted successfully!");
  } catch (err) {
    console.error("Error inserting data");
    console.error(err);
  } finally {
    await pool.end();
    console.info("Database connection closed");
  }
}

/**
 * Removes data from database.
 *
 * Check docs for insertData for addiional information.
 */
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
