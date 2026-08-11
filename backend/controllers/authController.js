const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const { sendVerificationEmail } = require("../services/emailService");

exports.register = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {

            // Existing account but email not verified
            if (!existingUser.isVerified) {

                return res.status(400).json({
                    success: false,
                    message: "Email already registered but not verified"
                });

            }

            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Strong Password Validation
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

        if (!passwordRegex.test(password)) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters and include uppercase, lowercase, number and special character."
            });

        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Generate 6-digit verification code
        const verificationCode =
            Math.floor(
                100000 + Math.random() * 900000
            ).toString();

        // Code valid for 10 minutes
        const verificationCodeExpires =
            new Date(Date.now() + 10 * 60 * 1000);

        await sendVerificationEmail(
            email,
            verificationCode
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationCode,
            verificationCodeExpires
        });

        return res.status(201).json({

            success: true,

            message:
                "Registration successful. Verification code sent to your email.",

            email: user.email

        });

    }

    catch (err) {

        console.error("REGISTER ERROR:", err);

        return res.status(500).json({

            success: false,

            error: err.message

        });

    }

};

exports.login = async (req, res) => {

    try {

        const {

            email,

            password

        } = req.body;

        const user = await User.findOne({

            email

        });

        if (!user) {

            return res.status(400).json({

                success: false,

                message: "Invalid Email"

            });

        }

        if (!user.isVerified) {

            return res.status(403).json({

                success: false,

                message:
                    "Please verify your email before logging in."
            });
        }

        const match = await bcrypt.compare(

            password,

            user.password

        );

        if (!match) {

            return res.status(400).json({

                success: false,

                message: "Invalid Password"

            });

        }

        const token = jwt.sign(

            {

                id: user._id

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.json({

            success: true,

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};
exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        res.json({

            success: true,

            user

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};

exports.uploadProfileImage = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Please select an image"

            });

        }

        const user = await User.findById(req.user.id);

        // Delete old image

        if (user.profileImage) {

            const oldImage = "." + user.profileImage;

            if (fs.existsSync(oldImage)) {

                fs.unlinkSync(oldImage);

            }

        }

        const imageName = Date.now() + ".jpg";

        const imagePath = `uploads/profile/${imageName}`;

        await sharp(req.file.path)

            .resize(200, 200)

            .jpeg({

                quality: 90

            })

            .toFile(imagePath);

        // fs.unlinkSync(req.file.path);

        user.profileImage = `/uploads/profile/${imageName}`;

        await user.save();

        res.json({

            success: true,

            user

        });

    }

    catch (err) {

        console.error("UPLOAD ERROR:", err);

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};

exports.updateProfile = async (req, res) => {

    try {

        const { name } = req.body;

        if (!name || name.trim() === "") {

            return res.status(400).json({

                success: false,

                message: "Name is required"

            });

        }

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        user.name = name.trim();

        await user.save();

        res.json({

            success: true,

            message: "Profile updated successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            }

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};
exports.changePassword = async (req, res) => {

    try {

        const {

            currentPassword,

            newPassword,

            confirmPassword

        } = req.body;

        if (

            !currentPassword ||

            !newPassword ||

            !confirmPassword

        ) {

            return res.status(400).json({

                success: false,

                message: "All fields are required"

            });

        }

        if (newPassword !== confirmPassword) {

            return res.status(400).json({

                success: false,

                message: "Passwords do not match"

            });

        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

        if (!passwordRegex.test(newPassword)) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must contain uppercase, lowercase, number and special character."

            });

        }

        const user = await User.findById(req.user.id);

        const match = await bcrypt.compare(

            currentPassword,

            user.password

        );

        if (!match) {

            return res.status(400).json({

                success: false,

                message: "Current password is incorrect"

            });

        }

        user.password = await bcrypt.hash(

            newPassword,

            10

        );

        await user.save();

        res.json({

            success: true,

            message: "Password updated successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};

exports.verifyEmail = async (req, res) => {

    try {

        const {
            email,
            code
        } = req.body;

        if (!email || !code) {

            return res.status(400).json({

                success: false,

                message: "Email and verification code are required"
            });
        }

        const user = await User.findOne({
            email
        });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"
            });
        }

        if (user.isVerified) {

            return res.status(400).json({

                success: false,

                message: "Email is already verified"
            });
        }

        if (
            !user.verificationCode ||
            user.verificationCode !== code
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid verification code"
            });
        }

        if (
            !user.verificationCodeExpires ||
            user.verificationCodeExpires < new Date()
        ) {

            return res.status(400).json({

                success: false,

                message: "Verification code has expired"
            });
        }

        user.isVerified = true;

        user.verificationCode = "";

        user.verificationCodeExpires = null;

        await user.save();

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({

            success: true,

            message: "Email verified successfully",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            }
        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            error: err.message
        });
    }
};

exports.setGooglePassword = async (req, res) => {
console.log("SET GOOGLE PASSWORD REQUEST RECEIVED");
    try {

        const {
            email,
            password,
            confirmPassword
        } = req.body;

        if (!email || !password || !confirmPassword) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        if (password !== confirmPassword) {

            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });

        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

        if (!passwordRegex.test(password)) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters and include uppercase, lowercase, number and special character."
            });

        }

        const user = await User.findOne({
            email
        });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        if (!user.googleId) {

            return res.status(400).json({
                success: false,
                message: "This account is not a Google account"
            });

        }

        if (user.isVerified) {

            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const verificationCode =
            Math.floor(
                100000 + Math.random() * 900000
            ).toString();

        const verificationCodeExpires =
            new Date(
                Date.now() + 10 * 60 * 1000
            );

        user.password = hashedPassword;

        user.verificationCode = verificationCode;

        user.verificationCodeExpires =
            verificationCodeExpires;

        await user.save();

        await sendVerificationEmail(
            email,
            verificationCode
        );

        return res.json({

            success: true,

            message:
                "Password saved. Verification code sent to your email.",

            email: user.email

        });

    }

    catch (err) {

        console.error(
            "GOOGLE PASSWORD ERROR:",
            err
        );

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};