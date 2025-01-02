const nodemailer = require("nodemailer");

exports.sendResetEmail = async (to, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Use your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"JobJott Support" process.env.EMAIL_USER`,
    to,
    subject: "Password Reset Request- Jobjott",
    html: `  <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hello,</h2>
        <p>We received a request to reset your password for your JobJott account.</p>
        <p>
          Don’t worry! Click the button below to reset your password:
        </p>
        <a href="${resetLink}" style="
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 0;
        ">Reset Password</a>
        <p>
          If you didn’t request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
        <p>Best regards,<br>The JobJott Team</p>
      </div>`,
  };

  await transporter.sendMail(mailOptions);
};
