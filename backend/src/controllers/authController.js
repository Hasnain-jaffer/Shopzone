import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      // role defaults to "user" automatically
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: "Error registering user", message: error.message });
  }
};

export const loginUser = async (req, res) => {
  console.log("Login request received with body:", req.body); // Debug log
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid email or password" });

    // 2. Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // 3. Generate JWT token with role inside
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Send token + user info to frontend
    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Error logging in", message: error.message });
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