import jwt from "jsonwebtoken";
import crypto from "crypto";
import AuthUser from "../models/userModel.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET || "gtw-secret-key-2024",
    { expiresIn: "24h" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.REFRESH_SECRET || "gtw-refresh-secret-2024",
    { expiresIn: "7d" }
  );
};

// ✅ Register
export const register = async (req, res) => {
  try {
    const { username, email, password, role = "admin" } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Username, email, and password are required",
        });
    }

    const existingUser = await AuthUser.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User with this email or username already exists",
        });
    }

    const user = new AuthUser({ username, email, password, role });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: user.toJSON(),
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Username and password are required",
        });
    }

    const user = await AuthUser.findOne({
      $or: [{ username }, { email: username }],
      isActive: true,
    });

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid credentials User not found",
        });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Login successful",
      user: user.toJSON(),
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
};

// ✅ Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await AuthUser.findOne({
      $or: [{ username }, { email: username }],
      isActive: true,
      role: "admin",
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Admin login successful",
      user: user.toJSON(),
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Admin login failed",
        error: error.message,
      });
  }
};

// ✅ Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET || "gtw-refresh-secret-2024",
      async (err, decoded) => {
        if (err)
          return res
            .status(403)
            .json({ success: false, message: "Invalid refresh token" });

        const user = await AuthUser.findById(decoded.id);
        if (!user || !user.isActive)
          return res
            .status(403)
            .json({ success: false, message: "User not found or inactive" });

        res.json({
          success: true,
          accessToken: generateAccessToken(user),
          refreshToken: generateRefreshToken(user),
        });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Token refresh failed",
        error: error.message,
      });
  }
};

// ✅ Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await AuthUser.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user: user.toJSON() });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to get profile",
        error: error.message,
      });
  }
};

// ✅ Update Profile
export const updateProfile = async (req, res) => {
  try {
    const user = await AuthUser.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const { username, email } = req.body;
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update profile",
        error: error.message,
      });
  }
};

// ✅ Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await AuthUser.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to change password",
        error: error.message,
      });
  }
};

// ✅ Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await AuthUser.find().sort({ createdAt: -1 });
    res.json({ success: true, users: users.map((u) => u.toJSON()) });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to get users",
        error: error.message,
      });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await AuthUser.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete user",
        error: error.message,
      });
  }
};

// ✅ Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const user = await AuthUser.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 600000;
    await user.save();

    res.json({ success: true, message: "OTP sent", otp });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to send OTP",
        error: error.message,
      });
  }
};

// ✅ Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const user = await AuthUser.findOne({
      email: req.body.email,
      resetPasswordOTP: req.body.otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to verify OTP",
        error: error.message,
      });
  }
};

// ✅ Reset Password
export const resetPassword = async (req, res) => {
  try {
    const user = await AuthUser.findOne({
      email: req.body.email,
      resetPasswordOTP: req.body.otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });

    user.password = req.body.newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to reset password",
        error: error.message,
      });
  }
};
