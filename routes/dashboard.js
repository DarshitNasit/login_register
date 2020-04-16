const express = require("express");
const router = express.Router();
const { valid_user } = require("../config/auth");

router.get("/", valid_user, (req, res, next) => {
  if (req.user) res.render("dashboard");
  else {
    req.flash("danger", "You have to login first");
    res.redirect("/users/login");
  }
});

module.exports = router;
