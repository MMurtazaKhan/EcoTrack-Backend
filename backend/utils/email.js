import nodemailer from "nodemailer";

export const sendMailToUser = async (email, emailTemplate) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: `'EcoTrack' <${process.env.EMAIL}>`,
    to: email,
    subject: "Forgot Password",
    html: emailTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

const createEmailTemplate = (name, email, password) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Thank You for Registering with EcoTrack!</h2>
      <p>Dear ${name},</p>
      <p>We are thrilled to welcome you to EcoTrack, where we are revolutionizing carbon footprint awareness. Your company's commitment to sustainability is commendable, and we are excited to support your efforts in reducing your carbon emissions.</p>
      <p>Here are your login credentials:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Thank you for joining us on this journey towards a greener future. If you have any questions or need assistance, please do not hesitate to reach out to our support team.</p>
      <p>Warm regards,</p>
      <p><strong>EcoTrack</strong><br />Revolutionizing Carbon Footprint Awareness</p>
    </div>
  `;
};

export const sendMailToCompany = async (email, companyName, companyEmail, companyPassword) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: `'EcoTrack' <${process.env.EMAIL}>`,
    to: email,
    subject: "Welcome to EcoTrack",
    html: createEmailTemplate(companyName, companyEmail, companyPassword),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};