// controllers/getProblemSolved.js

const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const getProblemSolved = async (req, res) => {
  try {
    const token = req.cookies.token;

    // 1️⃣ Check token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No token found.",
      });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // 3️⃣ Find user by email & populate problemSolved array
    const user = await User.findOne({ email: decoded.emailId })
      .select("problemSolved difficultyCount")
      .populate("problemSolved"); // optionally pass fields: .populate("problemSolved", "title difficulty tags")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ✅ Return problemSolved list & difficulty counts
    return res.status(200).json({
      success: true,
      problemSolved: user.problemSolved,
      difficultyCount: user.difficultyCount,
    });
  } catch (err) {
    console.error("Error in getProblemSolved:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : undefined,
    });
  }
};

module.exports = getProblemSolved;
