const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({ message: "No token, access denied" });
  }

  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;
    next();
  } catch (error) {
    res.json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;