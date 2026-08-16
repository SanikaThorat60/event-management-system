const mysql = require("mysql2");

//import the data from the .env file
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//connect a database
db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySql connected");

        // Ensure created_by column exists in events table
        db.query("ALTER TABLE events ADD COLUMN created_by INT DEFAULT NULL", (err) => {
            if (err) {
                if (err.code !== 'ER_DUP_FIELDNAME') {
                    console.error("Error adding created_by column:", err);
                }
            } else {
                console.log("Database Schema: added created_by column to events table");
            }
        });

        // Ensure ticket_price column exists in events table
        db.query("ALTER TABLE events ADD COLUMN ticket_price INT DEFAULT 0", (err) => {
            if (err) {
                if (err.code !== 'ER_DUP_FIELDNAME') {
                    console.error("Error adding ticket_price column:", err);
                }
            } else {
                console.log("Database Schema: added ticket_price column to events table");
            }
        });

        // Ensure role column exists in users table (just in case)
        db.query("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'", (err) => {
            if (err) {
                if (err.code !== 'ER_DUP_FIELDNAME') {
                    console.error("Error adding role column:", err);
                }
            } else {
                console.log("Database Schema: added role column to users table");
            }
        });

        // Ensure event_id column exists in payments table
        db.query("ALTER TABLE payments ADD COLUMN event_id INT DEFAULT NULL", (err) => {
            if (err) {
                if (err.code !== 'ER_DUP_FIELDNAME') {
                    console.error("Error adding event_id column to payments table:", err);
                }
            } else {
                console.log("Database Schema: added event_id column to payments table");
            }
        });

        // Ensure amount column exists in payments table
        db.query("ALTER TABLE payments ADD COLUMN amount INT DEFAULT 0", (err) => {
            if (err) {
                if (err.code !== 'ER_DUP_FIELDNAME') {
                    console.error("Error adding amount column to payments table:", err);
                }
            } else {
                console.log("Database Schema: added amount column to payments table");
            }
        });

        // Ensure created_at column exists in payments table
        db.query("ALTER TABLE payments ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP", (err) => {
            if (err) {
                if (err.code !== 'ER_DUP_FIELDNAME') {
                    console.error("Error adding created_at column to payments table:", err);
                }
            } else {
                console.log("Database Schema: added created_at column to payments table");
            }
        });

        // Ensure image_url column exists in events table
        db.query("ALTER TABLE events ADD COLUMN image_url LONGTEXT DEFAULT NULL", (err) => {
            if (err) {
                if (err.code !== 'ER_DUP_FIELDNAME') {
                    console.error("Error adding image_url column to events table:", err);
                }
            } else {
                console.log("Database Schema: added image_url column to events table");
            }
        });
    }
});

module.exports = db;