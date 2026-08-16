const express = require("express");
const router = express.Router();
const { getEvents, createEvent, deleteEvent, updateEventDescription } = require("../controllers/eventController");
const { verifyToken, verifyRole } = require("../middleware/auth");

router.get("/events", verifyToken, getEvents);
router.post("/events", verifyToken, verifyRole("manager"), createEvent);
router.delete("/events/:id", verifyToken, verifyRole("manager"), deleteEvent);
router.put("/events/:id/description", verifyToken, verifyRole("manager"), updateEventDescription);

module.exports = router;
