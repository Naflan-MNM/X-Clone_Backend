import User from "../model/schema/UserSchema.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import generateToken from "../utils/generateToken.js";

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
const login = (req, res) => {
  //generateToken();
  res.send("this  is login");
};
const logout = (req, res) => {
  res.send("this  is logout");
};

export { signup, login, logout };
