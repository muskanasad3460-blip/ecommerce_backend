import jwt from "jsonwebtoken";
import User from "../models/User.js";
import validator from "validator";
import bcrypt from "bcryptjs";

const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|onboarded\.com)$/;
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Only @gmail.com and @onboarded.com emails are allowed",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include letters, numbers, and special characters (@#$%)",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Only @gmail.com and @onboarded.com emails are allowed",
      });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and passowrd required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include letters, numbers, and special characters (@#$%)",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
    console.log("Login email:", email);
    console.log("Entered password:", password);

    // const user = await User.findOne({ email });

    if (user) {
      console.log("Stored hash:", user.password);

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isMatch);
    }
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// export const forgotPassword = async (req, res) => {
//   try {
//     const { email, newPassword } = req.body;

//     // 1. check user exist
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 2. validate password

//     if (!passwordRegex.test(newPassword)) {
//       return res.status(400).json({
//         message: "Password must be 8+ chars, include number & special char",
//       });
//     }

//     // 3. hash password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // 4. update password
//     user.password = hashedPassword;
//     await user.save();

//     res.json({ message: "Password updated successfully" });
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         message: "Only @gmail.com and @onboarded.com emails allowed",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

let otpStore = {};
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[cleanEmail] = otp; // ✅ ALWAYS cleanEmail

    console.log("OTP generated:", otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("SEND OTP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    console.log("Resetting password:", cleanEmail);
    console.log("Stored OTP:", otpStore[cleanEmail]);
    console.log("Entered OTP:", otp);

    // ✅ FIX 1: OTP check
    if (
      !otpStore[cleanEmail] ||
      otpStore[cleanEmail].toString() !== otp.toString().trim()
    ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ FIX 2: password validation
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include letters, numbers, and special characters",
      });
    }

    // ✅ FIX 3: find user
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ FIX 4: IMPORTANT (NO HASH HERE)
    user.password = newPassword;
    await user.save();

    // ✅ FIX 5: delete OTP
    delete otpStore[cleanEmail];

    console.log("Password updated successfully");

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error); // 👈 VERY IMPORTANT
    res.status(500).json({ message: error.message });
  }
};
