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

function checkAuthenticationForUD(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ message: "You must log in first" });
  }

  if (req.params.id.equals(req.params.userId)) {
    return next();
  }

  return res.status(401).send({
    message:
      "Access restricted: this operation is only allowed for your own user",
  });
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAuthenticationForUD,
};
