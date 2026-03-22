const { pool } = require("./db");

function findAllUsers() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users", [], (err, res) => {
      if (err) return reject(err);
      resolve(res.rows);
    });
  });
}

function findUserById(id) {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE id = $1", [id], (err, res) => {
      if (err) return reject(err);
      if (res.rows.length === 0) return reject("User not found");
      resolve(res.rows[0]);
    });
  });
}

module.exports = {
  findAllUsers,
  findUserById,
};
