const { pool } = require("./db");

/**
 * Show count of likes on specified post to show it in frontend near like button.
 *
 * @param {int} post_id Post ID by which the posts likes are found
 * @returns Promise which resolves with likes count or rejects with error message.
 */
function countLikesByPostId(post_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT COUNT(*) FROM likes WHERE post_id = $1`,
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
 * Find all likes by user id to filter out posts and show all users liked posts in profile.
 *
 * @param {int} user_id User ID to find likes of
 * @returns Promise which resolves with all likes that are done by user or rejects with error message.
 */
function findLikesByUserId(user_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM likes WHERE user_id = $1`,
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
 * Saves like to database.
 *
 * @param {Object} like Like object containing post_id and user_id.
 * @returns Promise which resolves with like object or rejects with error message
 */
function saveLike(like) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *",
      [like.post_id, like.user_id],
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
 * Deletes like from database.
 *
 * @param {Object} like Like object containing post_id and user_id.
 * @returns Promise which resolves empty or rejects with error message
 */
function deleteLikeById(like) {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
      [like.post_id, like.user_id],
      (err, res) => {
        if (err) {
          reject({ message: err });
          return;
        }

        if (res.rowCount === 0) {
          reject({
            message: `Like with post_id: ${like.post_id}, user_id: ${like.user_id} not found.`,
            suggestion: "Verify the IDs or check available likes.",
          });
          return;
        }

        resolve();
      },
    );
  });
}

/**
 * Tells if user has liked a post or not, to not allow duplicate likes.
 *
 * @param {int} post_id Post ID to be checked for like
 * @param {int} user_id User ID to be checked for like
 * @returns True if post has been liked or false if not.
 */
function isPostLikedByUserId(post_id, user_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2`,
      [post_id, user_id],
      (err, res) => {
        if (err) return reject({ message: err });

        resolve(res.rowCount > 0);
      },
    );
  });
}

module.exports = {
  countLikesByPostId,
  findLikesByUserId,
  saveLike,
  deleteLikeById,
  isPostLikedByUserId,
};
