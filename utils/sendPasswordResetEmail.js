import nodemailer from 'nodemailer';

async function sendPasswordResetEmail(props) {
  const transporter = nodemailer.createTransport({
    // Configure the transporter with your email service credentials
    host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
    service: 'gmail',
    auth: {
      user: 'yadav445@gmail.com',
      pass: 'vcqgccgobitvbslz',
    },
  });

  const mailOptions = {
    from: 'yadav445@gmail.com',
    to: props.email,
    subject: 'Password Reset',
    text: `Click on the following link to reset your password: http://example.com/reset/${props.token} else ignore it if you have not requested it.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
}

export default  sendPasswordResetEmail ;
