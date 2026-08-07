const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const chatController = require("../controllers/chatController");

router.post(
    "/",
    auth,
    chatController.chat
);

router.get(
    "/:noteId",
    auth,
    chatController.getChatHistory
);

router.delete(
    "/:noteId",
    auth,
    chatController.clearChat
);

module.exports = router;