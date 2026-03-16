import User from "../model/schema/UserSchema.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import generateToken from "../utils/generateToken.js";

/* signup controller */
const signup = async (req, res) => {
  try {
    const { username, fullname, password, email } = req.body;
    if (!username || !fullname || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }
    //still your email validator not working properly as you expect
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({
        error: "Username or email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        message: "User created successfully",
      });
    }
  } catch (error) {
    console.log(`Error in signup controller: ${error}`);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

/* login controller */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        error: "Invalid username",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: "Invalid password",
      });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error(`Error in login controller: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* logout controller */
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    return res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.error(`Error in logout controller: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* getMe controller */
const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error(`Error in getMe controller: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { signup, login, logout, getMe };
