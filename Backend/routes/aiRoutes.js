const express = require("express");
const router = express.Router();

const { generateDescription, chatWithEvents, generateEventImage } = require("../controllers/aiController");
const { verifyToken } = require("../middleware/auth");

router.post("/generate-description", generateDescription);
router.post("/chat", verifyToken, chatWithEvents);
router.post("/generate-image", verifyToken, generateEventImage);

module.exports = router;