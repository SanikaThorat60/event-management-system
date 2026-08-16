const db = require("../config/db")

const getBooking = (req, res) => {
    const { role, email } = req.user;

    let sql;
    let queryParams = [];

    if (role === "manager") {
        // Managers see all bookings with event details
        sql = `
            SELECT b.*, e.name AS event_name, e.date AS event_date, e.time AS event_time, e.venue AS event_venue
            FROM bookings b 
            LEFT JOIN events e ON b.event_id = e.id
        `;
    } else {
        // Regular users only see their own bookings with event details
        sql = `
            SELECT b.*, e.name AS event_name, e.date AS event_date, e.time AS event_time, e.venue AS event_venue
            FROM bookings b 
            LEFT JOIN events e ON b.event_id = e.id 
            WHERE b.email = ?
        `;
        queryParams.push(email);
    }

    db.query(sql, queryParams, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
};

const createBooking = (req, res) => {
    const { name, email, phone, event_id } = req.body;
    if (!name || !email || !phone || !event_id) {
        return res.status(400).json({ error: "Missing required booking fields (name, email, phone, event_id)" });
    }
    const sql = "INSERT INTO bookings (name, email, phone, event_id) VALUES(?, ?, ?, ?)";

    db.query(sql, [name, email, phone, event_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Booking created successfully", bookingId: result.insertId });
    });
};

module.exports = { getBooking, createBooking };