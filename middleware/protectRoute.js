import jwt from "jsonwebtoken";
import User from "../model/schema/UserSchema.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({ error: "Unauthorized:No token provided" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(500).json({ error: "Unauthorized:Invalid Token" });
    }
    const user = await User.findOne({ _id: decode.userId }).select("-password"); //why this .select("-password") is when mongo return mongoose.doc then it won't carry password rec. instead other fileds are return by mongoo

    if (!user) {
      return res.status(400).json({ error: "User not found  " });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(`error in protuctRoute middleware: ${error}`);
    res.status(200).json({ error: "Internel server error" });
  }
};

export default protectRoute;
