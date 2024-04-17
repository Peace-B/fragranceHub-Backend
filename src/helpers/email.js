import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


//create nodemailer transporter 
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.SMTP_KEY
    }
})

//send message function
export const sendEmail = async (to, subject, msg) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        text: msg,
        html: `<body>
               <h2>${subject}</h2>
               <p>${msg}!</p>
               <b>Fragrance Hub Mgt.</b>
             </body>`
    }
    console.log(`Email sent to ${to}`);
    try {
        await transporter.sendMail(mailOptions)
    } catch (err) {
        console.log("Error sending Email", err.message);
    }
}



// sendEmail using the transporter