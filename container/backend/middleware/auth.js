const posts = require("../database/posts");
const logger = require("../config/logger");

/**
 * Checks for authentication using passports isAuthenticated parameter.
 *
 * Used for basic operation of posting posts, comments, etc.
 *
 * @param {Request} req reuest object.
 * @param {Response} res response object.
 * @param {Function} next next callback for middleware.
 * @returns next if authentication is succsful and status 401 code if error
 */
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  logger.error("User not logged in");
  return res.status(401).send({ message: "You must log in first" });
}

/**
 * Checks if user is not authenticated.
 *
 * Used for being able to send registration or login POST request.
 *
 * @param {Request} req reuest object.
 * @param {Response} res response object.
 * @param {Function} next next callback for middleware.
 * @returns next if authentication is not succesful and status 401 code if is
 */
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    logger.info("User already logged in");
    return res.status(401).send({ message: "You are already logged in" });
  }

  return next();
}

/**
 * Checks ownership of a post, to do UPDATE and DELETE operations only to own posts.
 *
 * @param {Request} req reuest object.
 * @param {Response} res response object.
 * @param {Function} next next callback for middleware.
 * @returns next if authentication is succsful and sends status codes and errors otherwise
 */
async function checkAuthenticationForUD(req, res, next) {
  if (!req.isAuthenticated()) {
    logger.error(
      "Error: must log in first before proceeding with this operation",
    );
    return res.status(401).send({ message: "You must log in first" });
  }

  let post;

  try {
    const postId = parseInt(req.params.id);
    post = await posts.findPostById(postId);
  } catch (err) {
    logger.error("Error while authenticating operation: " + err);
    return res.status(404).send(err);
  }

  if (post.user_id != req.user.id) {
    logger.error(
      "Error while authenticating: access restricted for this operation.",
    );
    return res.status(403).send({
      message:
        "Access restricted: this operation is only allowed for own posts",
    });
  }

  next();
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAuthenticationForUD,
};
