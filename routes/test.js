const express = require("express");
const router = express.Router();

const arr = [
  {
    name: "Darshit",
    email: "Email",
  },
];

router.get("/", (req, res) => {
  res.send(arr);
});

module.exports = router;
