const { pool } = require("./db");

function findAllUsers() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users", [], (err, res) => {
      if (err) return reject(err);
      resolve(res.rows);
    });
  });
}

module.exports = {
  findAllUsers,
};
