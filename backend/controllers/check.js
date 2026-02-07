const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const redisClient = require("../config/redis");

const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token found" });
    }

    // Check if token is blacklisted in Redis
    const isBlocked = await redisClient.get(`token:${token}`);
    if (isBlocked) {
      return res.status(401).json({ success: false, message: "Token is blocked" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await User.findOne({ email: decoded.emailId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        difficultyCount: user.difficultyCount, // add if needed frontend usage
      },
    });

  } catch (err) {
    console.error("Auth check error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = checkAuth;