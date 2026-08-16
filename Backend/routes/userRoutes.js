const express = require("express");//Imports Express

const router = express.Router();//Creates a router object
//Instead of writing all routes in server.js, we create separate route files
const { getUsers } =
    require("../controllers/userController");//Imports the getUsers function from your controller.

router.get("/", getUsers);//Creates a GET API. When you visit /api/users, it runs getUsers.

module.exports = router;