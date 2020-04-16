module.exports = {
  valid_user: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    else {
      req.flash("danger", "You must have to login in first");
      res.redirect("/users/login");
    }
  },
  already_login: (req, res, next) => {
    if (req.isAuthenticated()) {
      req.flash("danger", "Already Login");
      res.redirect("/dashboard");
      return;
    }
    next();
  },
};
