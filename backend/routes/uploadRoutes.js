const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadController = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");

const uploadDir = path.join(
    __dirname,
    "../uploads"
);

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadDir);

    },

    filename(req, file, cb) {

        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );

    }

});

const upload = multer({
    storage
});

router.post(
    "/",
    authMiddleware,
    upload.single("file"),
    uploadController.uploadFile
);

module.exports = router;