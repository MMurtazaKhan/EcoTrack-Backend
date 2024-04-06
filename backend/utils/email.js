import nodemailer from "nodemailer";

export const sendMailToUser = async (email, emailTemplate) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  var mailOptions = {
    from: `'EcoTrack' <${process.env.EMAIL}>`,
    to: email,
    subject: "Fogot Password",
    html: emailTemplate,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err, "errrrrrrrrrrr");
      // return next(new errorHandler(err.message, 401));
    } else {
      // return next(new errorHandler(userData, 200));
    }
  });
};
