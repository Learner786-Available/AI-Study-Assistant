const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    deleteNote,

    getSingleNote

} = require("../controllers/noteController");

router.get(

    "/:id",

    authMiddleware,

    getSingleNote

);

router.delete(

    "/:id",

    authMiddleware,

    deleteNote

);

module.exports = router;