function status403(res) {
    res.status(403);
    res.render("error403.ejs");
}

function isAuthenticatedPerson(req, res, next) {
    if (req.session.usertype) {
      next()
    } else {
      status403(res)
    }
}

function isAuthenticatedAdmin(req, res, next) {
    if (req.session.usertype === "admin") {
      next()
    } else {
      status403(res)
    }
}

function isAuthenticatedCustomer(req, res, next) {
    if (req.session.usertype === "customer") {
      next()
    } else {
      status403(res)
    }
}

function isNotAuthenticated(req, res, next) {
  if (!req.session.usertype) {
    next()
  } else {
    status403(res)
  }
}


module.exports = {isAuthenticatedPerson, isAuthenticatedAdmin, isAuthenticatedCustomer, isNotAuthenticated, status403}