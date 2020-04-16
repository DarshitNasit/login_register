require("dotenv").config();

// imports
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const expressValidator = require("express-validator");

// main application
const app = express();

// Database
const db = require("./config/database").database;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Set Path
app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname, "public"));

// view engine
app.set("view engine", "pug");

// Security
app.use(express.static(path.join(__dirname, "public")));
app.use("/myFolder", express.static(path.join(__dirname, "/public")));

//Body Parser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Connect flash Express Validator and Express Messages
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;
      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

// Passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Global User
app.use("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/test", require("./routes/test"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/contactus", require("./routes/contact_us"));

// listen on browser
const port = 5000;
app.listen(port, () => console.log(`Listning server on port ${port}`));
