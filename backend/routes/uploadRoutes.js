const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadController = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");

const uploadDir = path.join(__dirname, "../uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({

    destination(req, file, cb) {

        console.log("UPLOAD DIRECTORY:", uploadDir);

        cb(null, uploadDir);

    },

    filename(req, file, cb) {

        const filename =
            Date.now() + path.extname(file.originalname);

        console.log("UPLOADING FILE:", filename);

        cb(null, filename);

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