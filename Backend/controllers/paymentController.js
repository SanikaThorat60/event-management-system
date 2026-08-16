const db = require("../config/db.js");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
    try {
        const options = {
            amount: req.body.amount * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
            currency: "INR"
        };
        const order = await razorpay.orders.create(options);
        res.json({
            key_id: process.env.RAZORPAY_KEY_ID,
            order
        });
    } catch (error) {
        console.warn("Razorpay order creation failed, falling back to mock order:", error.message);
        const mockOrderId = "order_mock_" + Math.random().toString(36).substring(2, 11);
        res.json({
            key_id: "mock_key_id",
            order: {
                id: mockOrderId,
                amount: req.body.amount * 100,
                currency: "INR"
            },
            isMock: true
        });
    }
};

const verifyPayment = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, event_id, amount } = req.body;
    const email = req.user?.email || null;
    const crypto = require("crypto");

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
        const sql = "INSERT INTO payments (event_id, amount, email) VALUES (?, ?, ?)";
        db.query(sql, [event_id, amount, email], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ status: "success", message: "Payment verified and recorded successfully" });
        });
    } else {
        res.status(400).json({ error: "Invalid signature, verification failed" });
    }
};

const savePayment = (req, res) => {
    const { event_id, amount } = req.body;
    const email = req.user?.email || null;
    const sql = "INSERT INTO payments (event_id, amount, email) VALUES (?, ?, ?)";
    db.query(sql, [event_id, amount, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ status: "success", message: "Payment saved successfully" });
    });
};

const getPayments = (req, res) => {
    const { role, email } = req.user;
    let sql;
    let queryParams = [];

    if (role === "manager") {
        sql = "SELECT p.*, e.name as event_name FROM payments p LEFT JOIN events e ON p.event_id = e.id";
    } else {
        sql = "SELECT p.*, e.name as event_name FROM payments p LEFT JOIN events e ON p.event_id = e.id WHERE p.email = ?";
        queryParams.push(email);
    }

    db.query(sql, queryParams, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
};

module.exports = { getPayments, createOrder, verifyPayment, savePayment };