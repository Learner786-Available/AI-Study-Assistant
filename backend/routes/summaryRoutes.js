const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const summaryController = require("../controllers/summaryController");

router.post(

    "/",

    authMiddleware,

    summaryController.summary

);

module.exports = router;