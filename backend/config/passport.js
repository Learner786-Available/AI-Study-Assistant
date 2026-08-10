const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },

        async (accessToken, refreshToken, profile, done) => {

            try {

                const email =
                    profile.emails &&
                    profile.emails[0]
                        ? profile.emails[0].value.toLowerCase()
                        : null;

                if (!email) {

                    return done(
                        null,
                        false,
                        {
                            message:
                                "Google account email not available"
                        }
                    );

                }

                let user = await User.findOne({ email });

                // Existing account
                if (user) {

                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }

                    return done(null, user);
                }

                // New Google account
                const randomPassword =
                    Math.random().toString(36) +
                    Math.random().toString(36);

                const hashedPassword =
                    await bcrypt.hash(
                        randomPassword,
                        10
                    );

                user = await User.create({

                    name:
                        profile.displayName ||
                        "Google User",

                    email,

                    password: hashedPassword,

                    googleId: profile.id,

                    // IMPORTANT
                    isVerified: false,

                    verificationCode: "",

                    verificationCodeExpires: null

                });

                return done(null, user);

            }

            catch (err) {

                console.error(
                    "GOOGLE STRATEGY ERROR:",
                    err
                );

                return done(err, null);

            }

        }
    )
);

module.exports = passport;