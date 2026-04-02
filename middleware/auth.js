const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "No token" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.json({ error: "User no longer exists" });
        }
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;