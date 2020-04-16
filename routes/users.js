const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { valid_user, already_login } = require("../config/auth");

// Login
router.get("/login", already_login, (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    successFlash: "You have successfully logged in",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", valid_user, (req, res, next) => {
  req.logout();
  req.flash("success", "You have successfully logout");
  res.redirect("/users/login");
});

//Register
router.get("/register", already_login, (req, res, next) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  req.checkBody("name", "Please Enter Your Name").notEmpty();
  req.checkBody("email", "Please Enter Your Email ID").notEmpty();
  req.checkBody("password", "Please Enter Your Password").notEmpty();
  req.checkBody("password2", "Please Enter Your Confirm Password").notEmpty();

  const validation_errors = req.validationErrors();

  if (validation_errors) {
    return res.render("register", {
      errors: validation_errors,
      name: name,
      email: email,
    });
  }

  const errors = [];

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
    return res.render("register", {
      errors,
      name,
      email,
    });
  }

  User.findOne({ email: email }, (err, user) => {
    if (err) return console.log(err);

    if (user) {
      errors.push({ msg: "Already registerd user with same Email ID" });
      res.render("register", {
        errors,
        name,
        email,
      });
      return;
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) return console.log(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return console.log(err);

        const new_user = new User({
          name: name,
          email: email,
          password: hash,
        });

        new_user.save((err) => {
          if (err) return console.log(err);
          req.flash(
            "success",
            "You have successfully registered and can LogIn"
          );
          res.redirect("/users/login");
        });
      });
    });
  });
});

module.exports = router;
