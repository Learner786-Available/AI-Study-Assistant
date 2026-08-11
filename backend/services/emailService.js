const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },

    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000
});

const sendVerificationEmail = async (email, code) => {

    await transporter.sendMail({

        from: `"AI Study Assistant" <${process.env.EMAIL_USER}>`,

        to: email,

        subject: "Verify your AI Study Assistant account",

        html: `
            <div style="font-family: Arial, sans-serif; padding: 30px;">

                <h2>AI Study Assistant</h2>

                <p>
                    Thank you for creating your account.
                </p>

                <p>
                    Your verification code is:
                </p>

                <h1 style="letter-spacing: 8px;">
                    ${code}
                </h1>

                <p>
                    This code will expire in 10 minutes.
                </p>

                <p>
                    If you did not create this account, you can ignore this email.
                </p>

            </div>
        `
    });
};

module.exports = {
    sendVerificationEmail
};