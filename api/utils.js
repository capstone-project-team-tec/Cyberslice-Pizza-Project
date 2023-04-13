// Middleware function that checks if a user is logged in.
function requireUser(req, res, next) {
  console.log("this is req.user", req.user)
  if (!req.user) {
    next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
    });
  }
  next();
}

// Middleware function that checks if the user is an admin.
function requireAdmin(req, res, next) {
  console.log("this is req.user", req.user);
  if (!req.user || !req.user.isAdmin) {
    return next({
      name: "MissingAdminError",
      message: "You must be logged in as an admin to perform this action",
    });
  }
  next();
}

module.exports = {
  requireUser,
  requireAdmin
}