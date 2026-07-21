import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

// Generates a random, URL-safe, human-typeable password (16 chars)
const generatePassword = () => {
  return crypto
    .randomBytes(16)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 16);
};

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("DB Connected");

    const email = `admin${Math.floor(1000 + Math.random() * 9000)}@shopzone.com`;
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Remove any existing seeded admin with this pattern isn't necessary;
    // instead upsert a single canonical admin record.
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      existingAdmin.email = email;
      existingAdmin.password = hashedPassword;
      existingAdmin.firstName = "Store";
      existingAdmin.lastName = "Admin";
      await existingAdmin.save();
    } else {
      await User.create({
        firstName: "Store",
        lastName: "Admin",
        email,
        password: hashedPassword,
        role: "admin",
      });
    }

    console.log("\n===================================");
    console.log(" ADMIN ACCOUNT CREATED / RESET");
    console.log("===================================");
    console.log(` Email:    ${email}`);
    console.log(` Password: ${plainPassword}`);
    console.log("===================================");
    console.log(" Save these credentials now — the password is only shown once.");
    console.log("===================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Admin seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
