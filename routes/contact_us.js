const router = require("express").Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.TEMP_EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.get("/", (req, res) => {
  res.render("contact_us");
});

router.post("/", (req, res) => {
  const message_user = `
    <p>Welcome to my smart bricks learning site.</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Full name : ${req.body.name}</li>
        <li>Email : ${req.body.email}</li>
        <li>Text : ${req.body.message}</li>
    </ul>
    <h3>We will contact you soon.</h3>
`;

  const mail_options_user = {
    from: process.env.EMAIL,
    to: req.body.email,
    bcc: process.env.MY_EMAIL,
    subject: "First trial",
    text: `If you have received a mail then you are lucky ${req.body.name}.`,
    html: message_user,
  };

  transporter.sendMail(mail_options_user, (err, info) => {
    if (err) console.log(err);
    else {
      console.log("Success " + info.response);
      req.flash("success", "Your mail has been sent");
      res.redirect("/contactus");
    }
  });
});

module.exports = router;
