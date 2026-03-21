const { pool } = require("./db");

function findAllPosts() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM posts", [], (err, res) => {
      if (err) return reject(err);
      resolve(res.rows);
    });
  });
}

module.exports = {
  findAllPosts,
};
