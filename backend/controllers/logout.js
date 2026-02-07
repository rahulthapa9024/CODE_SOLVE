const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).json({ success: false, message: "No token found in cookies." });
    }

    const payload = jwt.decode(token);

    if (!payload || !payload.exp) {
      return res.status(400).json({ success: false, message: "Invalid token." });
    }

    // Block token in Redis until expiration time
    await redisClient.set(`token:${token}`, 'Blocked');
    await redisClient.expireAt(`token:${token}`, payload.exp);

    const isProduction = process.env.NODE_ENV === "production";

    // Clear cookie with same options used when setting it
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({ success: true, message: "Logged out successfully." });

  } catch (err) {
    console.error("Logout Error:", err.message);
    return res.status(503).json({ success: false, message: "Logout failed", error: err.message });
  }
};

module.exports = logout;