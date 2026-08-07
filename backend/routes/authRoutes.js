const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const uploadProfile = require("../middleware/profileUpload");

const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    uploadProfileImage
} = require("../controllers/authController");

router.post("/register", register);

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

module.exports = router;