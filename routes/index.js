const express = require("express");
const router = express.Router();
const { already_login } = require("../config/auth");

router.get("/", already_login, (req, res, next) => {
  res.render("index");
});

module.exports = router;
