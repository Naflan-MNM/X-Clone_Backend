import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/Routes.js";
import connectDB from "./db/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use("/auth/api", authroutes);

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  connectDB();
});
