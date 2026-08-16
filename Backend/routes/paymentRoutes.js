const express = require("express");

const { getPayments, createOrder, savePayment } = require("../controllers/paymentController.js");

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/save", savePayment);
router.get("/orders", getPayments);

module.exports = router;