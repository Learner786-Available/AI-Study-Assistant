const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const progressController = require("../controllers/progressController");

const { cancelJob } = require("../utils/cancelManager");

// SSE Progress
router.get(
    "/",
    auth,
    progressController.progress
);

// Cancel Upload
router.post(
    "/cancel",
    auth,
    (req, res) => {

        cancelJob(req.user.id);

        return res.json({

            success: true,

            message: "Upload Cancelled"

        });

    }
);

module.exports = router;