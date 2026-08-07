const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const historyController = require("../controllers/historyController");

router.post(

    "/",

    authMiddleware,

    historyController.saveHistory

);

router.get(

    "/highscore/:noteId",

    authMiddleware,

    historyController.getHighScore

);

router.get(

    "/:noteId",

    authMiddleware,

    historyController.getHistory

);

module.exports = router;