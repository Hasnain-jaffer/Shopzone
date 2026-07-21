import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";

const signToken = (user) =>
  jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.TOKEN_SECRET,
    { expiresIn: "7d" }
  );

const toPublicUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
});

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      // role defaults to "user" automatically — never taken from the
      // request body, so a client can never register themselves as admin.
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: "Error registering user", message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // Same status code (401) and message whether the email doesn't exist
    // or the password is wrong — a different status code here would let
    // an attacker enumerate which emails have accounts.
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user);

    // httpOnly cookie — the website frontend relies on this exclusively
    // and never touches the token in JS. The token is also still returned
    // in the body for any non-browser client (e.g. a future mobile app)
    // that can't rely on cookies.
    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: toPublicUser(user)
    });

  } catch (error) {
    res.status(500).json({ error: "Error logging in", message: error.message });
  }
};

export const logoutUser = (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ message: "Logged out successfully" });
};

// Returns the current authenticated user from a fresh DB read (not just
// whatever was baked into the JWT at login time), so a role change takes
// effect immediately instead of only after the token expires/re-issues.
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user: toPublicUser(user) });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching current user", message: error.message });
  }
};

// ---- Admin-only user management ----

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching users", message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }
    if (req.params.id === req.user._id) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: "Error updating user", message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting user", message: error.message });
  }
};
