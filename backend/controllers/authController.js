const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

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

        const existingUser = await User.findOne({

            email

        });

        if (existingUser) {

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

        const user = await User.create({

            name,

            email,

            password: hashedPassword

        });

        res.status(201).json({

            success: true,

            message: "Registration Successful"

        });

    }

    catch (err) {

        res.status(500).json({

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