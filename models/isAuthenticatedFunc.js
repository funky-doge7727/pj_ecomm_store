function status403() {
    res.status(403);
    res.send("You're not allowed to do this");
}

function isAuthenticatedPerson(req, res, next) {
    if (req.session.usertype) {
      next()
    } else {
      status403()
    }
}

function isAuthenticatedAdmin(req, res, next) {
    if (req.session.usertype === "admin") {
      next()
    } else {
      status403()
    }
}

function isAuthenticatedCustomer(req, res, next) {
    if (req.session.usertype === "customer") {
      next()
    } else {
      status403()
    }
}

function isNotAuthenticated(req, res, next) {
  if (!req.session.usertype) {
    next()
  } else {
    status403()
  }
}


module.exports = {isAuthenticatedPerson, isAuthenticatedAdmin, isAuthenticatedCustomer, isNotAuthenticated, status403}