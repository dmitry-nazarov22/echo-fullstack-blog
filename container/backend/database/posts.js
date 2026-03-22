const { pool } = require("./db");

function findAllPosts() {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT posts.id, posts.body, posts.created_at, users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC`,
      [],
      (err, res) => {
        if (err) return reject(err);
        resolve(res.rows);
      },
    );
  });
}

function findPostsByUserId(user_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT posts.id, posts.body, posts.created_at, users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.user_id = $1
      ORDER BY posts.created_at DESC`,
      [user_id],
      (err, res) => {
        if (err) {
          reject("Failed to find posts by user id.");
          return;
        }
        resolve(res.rows);
      },
    );
  });
}

function savePost(post) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO posts (user_id, body) VALUES ($1, $2)",
      [post.user_id, post.body],
      (err) => {
        if (err) {
          reject("Error inserting post data: " + err);
          return;
        }
        resolve(post);
      },
    );
  });
}

function deletePostById(id) {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM posts WHERE id = $1", [id], (err, res) => {
      if (err) {
        reject("Failed to delete post data.");
        return;
      }

      if (res.rowCount === 0) {
        reject({
          error: `Post with ID ${id} not found.`,
          suggestion: "Verify the ID or check available posts.",
        });
        return;
      }

      resolve();
    });
  });
}

function edit(id, body) {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE posts SET body = $1 WHERE id = $2 RETURNING *`,
      [body, id],
      (err, res) => {
        if (err) {
          reject("Failed to update post: " + "err");
          return;
        }

        if (res.rowCount === 0) {
          reject({
            error: `Post with ID ${id} not found.`,
          });
          return;
        }

        resolve(res.rows[0]);
      },
    );
  });
}

module.exports = {
  findAllPosts,
  savePost,
  deletePostById,
  findPostsByUserId,
  edit,
};
