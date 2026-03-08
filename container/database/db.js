const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

async function initializeDatabase() {
  db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id          INTEGER     PRIMARY KEY,
            username    TEXT        UNIQUE          NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id          INTEGER     PRIMARY KEY,
            user_id     INTEGER,
            body        TEXT        NOT NULL,
            created_at  DATETIME    DEFAULT     CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id          INTEGER     PRIMARY KEY,
            post_id     INTEGER,
            user_id     INTEGER,
            body        TEXT        NOT NULL,
            created_at  DATETIME    DEFAULT     CURRENT_TIMESTAMP,

            FOREIGN KEY (post_id) REFERENCES posts(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS likes (
            post_id     INTEGER,
            user_id     INTEGER,

            PRIMARY KEY (post_id, user_id),

            FOREIGN KEY (post_id) REFERENCES posts(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
  });

  insertData();
}

function insertData() {
  db.serialize(() => {
    // Insert data, the ? placeholders prevent SQL injection
    db.run("INSERT INTO users (username) VALUES (?)", ["dimanazarov"]);
    db.run("INSERT INTO users (username) VALUES (?)", ["user1"]);
    db.run("INSERT INTO users (username) VALUES (?)", ["user2"]);
    db.run("INSERT INTO users (username) VALUES (?)", ["randomname123"]);
  });
}

module.exports = {
  db,
  initializeDatabase,
};
