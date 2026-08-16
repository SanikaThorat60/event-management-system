const db = require("../config/db");

const getAnalyticsSummary = async (req, res) => {
    try {
        const queryPromise = (sql, params = []) => {
            return new Promise((resolve, reject) => {
                db.query(sql, params, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
        };

        // Fetch metrics in parallel using Promises
        const [overallResults, eventSalesResults, eventBookingsResults] = await Promise.all([
            queryPromise("SELECT COALESCE(SUM(amount), 0) AS totalRevenue, COUNT(id) AS ticketsSold FROM payments"),
            queryPromise(`
                SELECT e.name, COALESCE(SUM(p.amount), 0) AS revenue, COUNT(p.id) AS ticketsSold 
                FROM events e 
                LEFT JOIN payments p ON e.id = p.event_id 
                GROUP BY e.id, e.name
            `),
            queryPromise(`
                SELECT e.name, COUNT(b.id) AS bookingCount 
                FROM events e 
                LEFT JOIN bookings b ON e.id = b.event_id 
                GROUP BY e.id, e.name
            `)
        ]);

        const summary = {
            totalRevenue: overallResults[0]?.totalRevenue || 0,
            ticketsSold: overallResults[0]?.ticketsSold || 0,
            eventSales: eventSalesResults,
            eventBookings: eventBookingsResults
        };

        res.json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAnalyticsSummary };
