const { pool } = require("./db");

function countLikesByPostId(post_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT COUNT(*) FROM likes WHERE post_id = $1`,
      [post_id],
      (err, res) => {
        if (err) {
          reject("Failed to count likes");
          return;
        }
        resolve(res.rows);
      },
    );
  });
}

function findLikesByUserId(user_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM likes WHERE user_id = $1`,
      [user_id],
      (err, res) => {
        if (err) {
          reject("Failed to find likes by user id.");
          return;
        }
        resolve(res.rows);
      },
    );
  });
}

function saveLike(like) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *",
      [like.post_id, like.user_id],
      (err, res) => {
        if (err) {
          reject("Error inserting like data: " + err);
          return;
        }
        resolve(res.rows[0]);
      },
    );
  });
}

function deleteLikeById(like) {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
      [like.post_id, like.user_id],
      (err, res) => {
        if (err) {
          reject("Failed to delete like data.");
          return;
        }

        if (res.rowCount === 0) {
          reject({
            error: `Like with post_id: ${like.post_id}, user_id: ${like.user_id} not found.`,
            suggestion: "Verify the IDs or check available likes.",
          });
          return;
        }

        resolve();
      },
    );
  });
}

function isPostLikedByUserId(post_id, user_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2`,
      [post_id, user_id],
      (err, res) => {
        if (err) return reject("Failed to check for like by user ID");

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
};
