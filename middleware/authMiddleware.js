const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.get("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });

    req.user = user; // attach user info to request
    next();
  });
};

module.exports = authenticateToken;
