const { pool } = require("./db");

/**
 * Finds all comments by post ID to display them below the post.
 *
 * JOIN users to show only comments by available users, not deleted ones.
 *
 * @param {int} post_id Posts ID
 * @returns Promise which resolves with all found comments in an array or rejects with error message.
 */
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
          reject({ message: err });
          return;
        }
        resolve(res.rows);
      },
    );
  });
}

/**
 * Find first comment of the post to display it in home view under the post.
 *
 * JOIN users to show only comments by available users, not deleted ones.
 *
 * @param {int} post_id Posts ID
 * @returns Promise which resolves with resulted rows array or rejects with error message.
 */
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
          reject({ message: err });
          return;
        }
        resolve(res.rows);
      },
    );
  });
}

/**
 * Finds comments by user id to display them in profile.
 *
 * @param {int} user_id Users ID.
 * @returns Promise which resolves with all comments made by user in an array or rejects with error message.
 */
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
          reject({ message: err });
          return;
        }
        resolve(res.rows);
      },
    );
  });
}

/**
 * Saves comment to database.
 *
 * @param {Object} comment Comment object containing post_id, user_id and body text
 * @returns Promise which resolves with the saved comment object or rejets with error message.
 */
function saveComment(comment) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO comments (post_id, user_id, body) VALUES ($1, $2, $3) RETURNING *",
      [comment.post_id, comment.user_id, comment.body],
      (err, res) => {
        if (err) {
          reject({ message: err });
          return;
        }
        resolve(res.rows[0]);
      },
    );
  });
}

/**
 * Deletes comment by id from the database.
 *
 * @param {int} id ID of a comment
 * @returns Promise which resolves empty or rejects with error
 */
function deleteCommentById(id, user_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM comments WHERE id = $1 AND user_id = $2",
      [id, user_id],
      (err, res) => {
        if (err) {
          reject({ message: err });
          return;
        }

        if (res.rowCount === 0) {
          reject({
            message: `Comment with ID ${id} not found.`,
            suggestion: "Verify the ID or check available comments.",
          });
          return;
        }

        resolve();
      },
    );
  });
}

/**
 * Edits comment in the database by id.
 *
 * @param {int} id Comment ID
 * @param {String} body Body text for comment
 * @returns Promise which resolves with edited comment object or rejects with error message.
 */
function editCommentById(id, user_id, body) {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE comments SET body = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
      [body, id, user_id],
      (err, res) => {
        if (err) {
          reject({ message: err });
          return;
        }

        if (res.rowCount === 0) {
          reject({
            message: `Comment with ID ${id} not found.`,
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
  editCommentById,
};
