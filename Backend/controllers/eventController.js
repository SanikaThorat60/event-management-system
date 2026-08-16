const db = require("../config/db");

const getEvents = (req, res) => {
    let sql = "SELECT * FROM events";
    let params = [];
    if (req.user && req.user.role === "manager") {
        sql = "SELECT * FROM events WHERE created_by = ?";
        params = [req.user.id];
    }
    db.query(sql, params, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
};

const createEvent = (req, res) => {
    const { name, description, date, time, venue, ticket_price, image_url } = req.body;
    if (!name || !description || !date || !time || !venue) {
        return res.status(400).json({ error: "Missing required event fields (name, description, date, time, venue)" });
    }
    const createdBy = req.user?.id || null;
    const price = ticket_price || 0;
    const imageUrl = image_url || null;
    const sql = "INSERT INTO events (name, description, date, time, venue, created_by, ticket_price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, description, date, time, venue, createdBy, price, imageUrl], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Event created successfully", eventId: result.insertId });
    });
};

const deleteEvent = (req, res) => {
    const eventId = req.params.id;
    let sql = "DELETE FROM events WHERE id = ?";
    let params = [eventId];
    if (req.user && req.user.role === "manager") {
        sql = "DELETE FROM events WHERE id = ? AND created_by = ?";
        params = [eventId, req.user.id];
    }
    db.query(sql, params, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Event deleted successfully" });
    });
};

const updateEventDescription = (req, res) => {
    const eventId = req.params.id;
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: "Missing description field" });
    }
    let sql = "UPDATE events SET description = ? WHERE id = ?";
    let params = [description, eventId];
    if (req.user && req.user.role === "manager") {
        sql = "UPDATE events SET description = ? WHERE id = ? AND created_by = ?";
        params = [description, eventId, req.user.id];
    }
    db.query(sql, params, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Event description updated successfully" });
    });
};

module.exports = { getEvents, createEvent, deleteEvent, updateEventDescription };