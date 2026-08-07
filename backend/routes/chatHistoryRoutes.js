const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    saveChat,

    getChatHistory

} = require("../controllers/chatHistoryController");

router.post(

    "/save",

    authMiddleware,

    saveChat

);

router.get(

    "/:noteId",

    authMiddleware,

    getChatHistory

);

module.exports = router;