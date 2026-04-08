const posts = require("../database/posts");

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send({ message: "You must log in first" });
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.status(401).send({ message: "You are already logged in" });
  }

  return next();
}

async function checkAuthenticationForUD(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ message: "You must log in first" });
  }

  let post;

  try {
    const postId = parseInt(req.params.id);
    post = await posts.findPostById(postId);
  } catch (err) {
    return res.status(404).send(err);
  }

  if (post.user_id !== req.user.id) {
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
