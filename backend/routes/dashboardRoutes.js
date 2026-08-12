const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getDashboard,
    getAllSummaries
} = require("../controllers/dashboardController");


router.get(
    "/",
    authMiddleware,
    getDashboard
);


router.get(
    "/summaries",
    authMiddleware,
    getAllSummaries
);


module.exports = router;