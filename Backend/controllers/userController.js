const db = require("../config/db");//Imports your MySQL database connection from db.js

//Creates a function named getUsers which handles requests
const getUsers = (req, res) => {
    const sql = "SELECT * FROM users";//SQL query to fetch all records from the users table.
    //err = Error if query fails
    //result = Data returned from MySQL
    db.query(sql, (err, result) => {//Executes the SQL query

        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);//Sends the database data back to the frontend
    });
};

module.exports = { getUsers };//Makes the function available to other files