const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    console.log("Auth middleware called-----------------------------------------------------------------");
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
    try {
        const user = jwt.verify(token, process.env.jwt_secret_key);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid token" });
    }
};

module.exports = authMiddleware;   // ✔️ EXPORT FUNCTION
