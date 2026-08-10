const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const uploadProfile = require("../middleware/profileUpload");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    uploadProfileImage,
    verifyEmail,
    setGooglePassword
} = require("../controllers/authController");

router.post("/register", register);

router.post("/verify-email", verifyEmail);

router.post(
    "/google/set-password",
    setGooglePassword
);

router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

router.post(
    "/upload-profile",
    authMiddleware,
    uploadProfile.single("image"),
    uploadProfileImage
);

router.put("/profile", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);
// Google Login
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

// Google Callback
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/"
    }),
    (req, res) => {

        const frontendURL =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";

        // Already verified user
        if (req.user.isVerified) {

            const token = jwt.sign(
                {
                    id: req.user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );

            return res.redirect(
                `${frontendURL}/google-success?token=${token}`
            );
        }

        // New Google user
        return res.redirect(
            `${frontendURL}/google-password?email=${encodeURIComponent(
                req.user.email
            )}`
        );

    }
);

module.exports = router;