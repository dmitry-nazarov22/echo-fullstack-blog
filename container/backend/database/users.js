const { pool } = require("./db");

/**
 * Finds all users from the user table.
 *
 * @returns Promise which resolves into all user rows or rejects with error.
 */
function findAllUsers() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users", [], (err, res) => {
      if (err) return reject(err);
      resolve(res.rows);
    });
  });
}

/**
 * Finds user by id.
 *
 * @param {int} id User id, by which the search will be done.
 * @returns Promise; resolves into single user object or reject with error.
 * Can reject into 'User not found' message if no rows are found.
 */
function findUserById(id) {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE id = $1", [id], (err, res) => {
      if (err) return reject(err);
      if (res.rows.length === 0) return reject("User not found");
      resolve(res.rows[0]);
    });
  });
}

/**
 * Saves user to database.
 *
 * Returning the res.rows[0] to show values, that are added by database (such as user ID)
 *
 * @param {Object} user User to be saved.
 * @returns Promise that resolves with saved User object or rejects with error.
 */
function saveUser(user) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users (username, password, description) VALUES ($1, $2, $3) RETURNING *",
      [user.username, user.password, user.description],
      (err, res) => {
        if (err) return reject(err);
        resolve(res.rows[0]);
      },
    );
  });
}

module.exports = {
  findAllUsers,
  findUserById,
  saveUser,
};
