const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, code) => {

    const { data, error } = await resend.emails.send({

        from: "AI Study Assistant <onboarding@resend.dev>",

        to: [email],

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

    if (error) {

        console.error("RESEND EMAIL ERROR:", error);

        throw new Error(error.message);

    }

    console.log("Verification email sent:", data?.id);

    return data;
};

module.exports = {
    sendVerificationEmail
};