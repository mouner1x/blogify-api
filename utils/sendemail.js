const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config({path:"config.env"});
const app_email = process.env.app_email;
const app_password = process.env.app_password
async function sendEmail(userEmail, subject, htmlTemplate) {

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user:app_email,
        pass:app_password
      }
    });

    const mailOptions = {
      from:'kate@mailtrap.io',
      to: userEmail, 
      subject: subject,
      html: htmlTemplate
    };

 const info =   await transporter.sendMail(mailOptions);

  } catch (error) {
    console.log(error);
    throw new Error('Internal Server Error (nodemailer)'); 
  }

}


module.exports={
    sendEmail
}