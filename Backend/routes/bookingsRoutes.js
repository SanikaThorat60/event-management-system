const express = require("express");
const { getBooking, createBooking } = require("../controllers/bookingController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/bookings", verifyToken, getBooking);
router.post("/bookings", verifyToken, createBooking);

module.exports = router;