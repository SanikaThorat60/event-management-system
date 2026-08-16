require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingsRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes");
const generateDescription = require("./routes/aiRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const app = express();

//middleware
app.use(cors());//allows any website to connect to this backend.
app.use(express.json());//allows me to get data from the frontend.

//create a route
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", generateDescription);
app.use("/api/analytics", analyticsRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});