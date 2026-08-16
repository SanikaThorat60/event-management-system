const express = require("express");
const { getPayments, createOrder, savePayment } = require("../controllers/paymentController.js");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/create-order", verifyToken, createOrder);
router.post("/save", verifyToken, savePayment);
router.get("/orders", verifyToken, getPayments);

module.exports = router;