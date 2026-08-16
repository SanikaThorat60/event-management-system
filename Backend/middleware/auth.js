const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (userRole !== requiredRole) {
            return res.status(403).json({ message: "Access Denied. Manager only" });
        }
        next();
    };
};

module.exports = { verifyToken, verifyRole };