const express = require("express");
const router = express.Router();
const { getAnalyticsSummary } = require("../controllers/analyticsController");
const { verifyToken, verifyRole } = require("../middleware/auth");

router.get("/summary", verifyToken, verifyRole("manager"), getAnalyticsSummary);

module.exports = router;
