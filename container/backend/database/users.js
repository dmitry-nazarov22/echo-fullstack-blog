const { pool } = require("./db");

/**
 * Finds all users from the user table.
 *
 * @returns Promise which resolves into all user rows or rejects with error.
 */
function findAllUsers() {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT id, username, description FROM users",
      [],
      (err, res) => {
        if (err) return reject({ message: err });
        resolve(res.rows);
      },
    );
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
      if (err) return reject({ message: err });
      if (res.rows.length === 0) return reject({ message: "User not found" });
      resolve(res.rows[0]);
    });
  });
}

/**
 * Finds user by username.
 *
 * @param {String} username Username, by which the search will be done.
 * @returns Promise; resolves into single user object or reject with error.
 * Can reject into 'User not found' message if no rows are found.
 */
function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
      (err, res) => {
        if (err) return reject({ message: err });
        if (res.rows.length === 0) return reject({ message: "User not found" });
        resolve(res.rows[0]);
      },
    );
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
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [user.username, user.password],
      (err, res) => {
        if (err) return reject({ message: err });
        resolve(res.rows[0]);
      },
    );
  });
}

/**
 * Edit user description which is automatically set to null when user is created.
 *
 * @param {Object} user Object containing user ID and description
 * @returns Promise that resolves with edited User object or rejects with error.
 */
function editDescription(user) {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE users SET description = $1 WHERE id = $2 RETURNING *`,
      [user.description, user.id],
      (err, res) => {
        if (err) {
          reject({ message: err });
          return;
        }

        if (res.rowCount === 0) {
          reject({
            error: `User with ID ${user.id} not found.`,
          });
          return;
        }

        resolve(res.rows[0]);
      },
    );
  });
}

module.exports = {
  findAllUsers,
  findUserById,
  findUserByUsername,
  saveUser,
  editDescription,
};
