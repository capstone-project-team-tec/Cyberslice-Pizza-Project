function requireUser(req, res, next) {
    if (!req.user) {
    next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
    });
    }

    next();
}

function requireAdmin(req, res, next) {
    if(!req.user) {
        next({
            name: "MissingAdminError",
            message: "You must be logged in as an admin to perform this action"
        })
    }
    next();
}

module.exports = {
    requireUser,
    requireAdmin
}

