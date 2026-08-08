const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination(req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/profile"));
},

    filename(req, file, cb) {

        cb(

            null,

            Date.now() + path.extname(file.originalname)

        );

    }

});

const fileFilter = (req, file, cb) => {

    const allowed = [

        "image/jpeg",

        "image/png",

        "image/jpg",

        "image/webp"

    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    }

    else {

        cb(new Error("Only image files are allowed"));

    }

};

module.exports = multer({

    storage,

    fileFilter,

    limits: {
    fileSize: 5 * 1024 * 1024
}


});