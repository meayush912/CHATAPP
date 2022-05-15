const express = require("express");
const { allMessages, sendMessage, } = require("../controllers/messageControllers");
const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;