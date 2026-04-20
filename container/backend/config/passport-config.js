const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

/**
 * Initializes Passport with local authentication strategy and session.
 *
 * @param {Passport} passport passport instance to initialize.
 * @param {Function} getUserByUsername async function to fetch user object by
 * username from the database.
 * @param {Function} getUserById async function to fetch user object by ID
 * from the database.
 */
function initialize(passport, getUserByUsername, getUserById) {
  /**
   * Verify user credentials with username and password.
   *
   * @param {String} username username of the user to be authenticated.
   * @param {String} password hashed password of the user to be authenticated.
   * @param {*} done Passport callback.
   * @returns done callback with either error, or success message.
   */
  const authenticateUser = async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);
      if (user == null) {
        return done(null, false, { message: "No user with that username" });
      }

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser),
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      return done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = initialize;
