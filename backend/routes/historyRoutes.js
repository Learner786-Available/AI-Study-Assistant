const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const historyController = require("../controllers/historyController");


// Save Quiz Result
router.post(
    "/",
    authMiddleware,
    historyController.saveHistory
);


// Get All Quiz History
router.get(
    "/all",
    authMiddleware,
    historyController.getAllHistory
);


// Get High Score
router.get(
    "/highscore/:noteId",
    authMiddleware,
    historyController.getHighScore
);


// Get Previous Attempts of One Note
router.get(
    "/:noteId",
    authMiddleware,
    historyController.getHistory
);


module.exports = router;