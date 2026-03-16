import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.route.js";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userroutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cookieParser());
app.use("/auth/api", authroutes);
app.use("/auth/users", userroutes);

app.get("/", (req, res) => {
  res.send("hello world!");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("DB connected fail", error);
  }
};

startServer();
