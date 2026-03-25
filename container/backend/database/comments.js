const { pool } = require("./db");

function findCommentsByPostId(post_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT comments.id, comments.body, comments.created_at, users.username
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = $1
      ORDER BY comments.created_at DESC`,
      [post_id],
      (err, res) => {
        if (err) {
          reject("Failed to find comments by post id.");
          return;
        }
        resolve(res.rows);
      },
    );
  });
}

function findFirstCommentByPostId(post_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT comments.id, comments.body, comments.created_at, users.username
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = $1
      ORDER BY comments.created_at DESC
      LIMIT 1`,
      [post_id],
      (err, res) => {
        if (err) {
          reject("Failed to find first comment by post id.");
          return;
        }
        resolve(res.rows);
      },
    );
  });
}

function findCommentsByUserId(user_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT comments.id, comments.body, comments.created_at, users.username
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.user_id = $1
      ORDER BY comments.created_at DESC`,
      [user_id],
      (err, res) => {
        if (err) {
          reject("Failed to find comments by user id.");
          return;
        }
        resolve(res.rows);
      },
    );
  });
}

function saveComment(comment) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO comments (post_id, user_id, body) VALUES ($1, $2, $3) RETURNING *",
      [comment.post_id, comment.user_id, comment.body],
      (err, res) => {
        if (err) {
          reject("Error inserting comment data: " + err);
          return;
        }
        resolve(res.rows[0]);
      },
    );
  });
}

function deleteCommentById(id) {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM comments WHERE id = $1", [id], (err, res) => {
      if (err) {
        reject("Failed to delete comment data.");
        return;
      }

      if (res.rowCount === 0) {
        reject({
          error: `Comment with ID ${id} not found.`,
          suggestion: "Verify the ID or check available comments.",
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
      `UPDATE comments SET body = $1 WHERE id = $2 RETURNING *`,
      [body, id],
      (err, res) => {
        if (err) {
          reject("Failed to update comment: " + "err");
          return;
        }

        if (res.rowCount === 0) {
          reject({
            error: `Comment with ID ${id} not found.`,
          });
          return;
        }

        resolve(res.rows[0]);
      },
    );
  });
}

module.exports = {
  findCommentsByPostId,
  findFirstCommentByPostId,
  findCommentsByUserId,
  saveComment,
  deleteCommentById,
  edit,
};
