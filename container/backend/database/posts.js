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
      "INSERT INTO posts (user_id, body, created_at) VALUES (?, ?)",
      [post.user_id, post.body, post.created_at],
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
    pool.query("DELETE FROM posts WHERE id = ?", [id], (err, result) => {
      if (err) {
        reject("Failed to delete post data.");
        return;
      }

      if (result.affectedRows == 0) {
        reject({
          error: `Post with ID ${id} not found.`,
          suggestion: "Verify the ID or check available posts.",
        });
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
