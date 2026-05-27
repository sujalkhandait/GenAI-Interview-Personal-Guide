const jwt = require("jsonwebtoken");
const Blacklist = require("../models/blacklist.model");

async function authMiddleware(req, res, next) {

  try {

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const blacklisted =
      await Blacklist.findOne({ token });

    if (blacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token invalidated",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.error(
      "Auth Middleware Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

module.exports = authMiddleware;