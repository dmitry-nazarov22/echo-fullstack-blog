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

module.exports = { checkAuthenticated };
