const { pool } = require("./db");

/**
 * Finds all posts.
 *
 * @returns Promise, which resolves with posts array or rejects with error.
 */
function findAllPosts() {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT posts.id, posts.body, posts.created_at, users.username,
      COUNT(likes.post_id) AS likes
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      GROUP BY posts.id, users.username
      ORDER BY posts.created_at DESC`,
      [],
      (err, res) => {
        if (err) return reject(err);
        resolve(res.rows);
      },
    );
  });
}

/**
 * Finds all posts by user ID to list them in profile.
 *
 * @param {*} user_id Users ID for finding posts.
 * @returns Promise that resolves with users posts array or with error message.
 */
function findPostsByUserId(user_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT posts.id, posts.body, posts.created_at, users.username,
      COUNT(likes.post_id) AS likes
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      WHERE posts.user_id = $1
      GROUP BY posts.id, users.username
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

/**
 * Saves post to database, to store new posts.
 *
 * Returning the res.rows[0] to show values, that are added by database (such as post ID)
 *
 * @param {*} post Post object to save.
 * @returns Promise that resolves with saved Post object or rejects with error.
 */
function savePost(post) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO posts (user_id, body) VALUES ($1, $2) RETURNING *",
      [post.user_id, post.body],
      (err, res) => {
        if (err) {
          reject("Error inserting post data: " + err);
          return;
        }
        resolve(res.rows[0]);
      },
    );
  });
}

/**
 * Deletes post by ID to remove it from database.
 *
 * res.rowcount shows affected rows number. In this case if no posts were deleted
 * it is 0.
 *
 * @param {*} id Post ID to be removed.
 * @returns Promise which resolves empty or rejects with different errors.
 */
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

/**
 * Edit post by id in the database.
 *
 * res.rowcount shows affected rows number. In this case if no posts were edited
 * it is 0.
 *
 * @param {*} id Post ID by which the editable post is found in the db.
 * @param {*} body Body text of the post.
 * @returns Promise which resolves with edited Post object or rejects with error message.
 */
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
