const { pool } = require("./db");

function findAllPosts() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM posts", [], (err, res) => {
      if (err) return reject(err);
      resolve(res.rows);
    });
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

module.exports = {
  findAllPosts,
  savePost,
  deletePostById,
};
