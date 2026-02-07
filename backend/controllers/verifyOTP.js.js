const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { otpStore } = require("../controllers/sendOTP");

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this email or it has expired",
      });
    }

    if (record.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP is valid — remove it from memory
    otpStore.delete(email);

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        showGoogleLogin: true,
        message:
          "User account not found. Please sign up using Google to continue.",
      });
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

    // Set environment flag for cookie options
    const isProduction = process.env.NODE_ENV === "production";

    // Send token as cookie with proper cross-site options
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: isProduction,             // true in production (HTTPS)
      sameSite: isProduction ? "none" : "lax", // cross-site in prod, lax in dev
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully, login successful",
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
    console.error("❌ Verify OTP error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = verifyOtp;