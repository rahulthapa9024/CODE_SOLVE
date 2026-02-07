const User = require("../models/userSchema.js");
const jwt = require("jsonwebtoken");

const GoogleLogin = async (req, res) => {
  try {
    const { displayName, email, photoURL } = req.body;

    if (!email || !photoURL || !displayName) {
      return res.status(400).json({
        success: false,
        message: "Display name, email, and photo URL are required",
      });
    }

    // Find existing user
    let user = await User.findOne({ email });

    // Get user count only if new registration is required
    if (!user) {
      const count = await User.countDocuments();

      if (count >= 10) {
        return res.status(403).json({
          success: false,
          message: "User limit reached (10 users max). Registration not allowed.",
        });
      }

      // Create new user if limit not reached
      user = await User.create({ displayName, email, photoURL });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        emailId: user.email,
        displayName: user.displayName,
        userId: user._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    // Determine environment
    const isProduction = process.env.NODE_ENV === "production";

    // Set cookie with proper options for cross-site cookies
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: isProduction,            // true on production (HTTPS), false on local dev (HTTP)
      sameSite: isProduction ? "none" : "lax", // none for prod, lax for dev
    });

    // Send response
    res.status(200).json({
      success: true,
      message: user ? "Login successful" : "Registration successful",
      user: {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        _id: user._id,
        difficultyCount: user.difficultyCount,
      },
      token,
    });
  } catch (err) {
    console.error("❌ Google login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = GoogleLogin;
