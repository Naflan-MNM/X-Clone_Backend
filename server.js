import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/Routes.js";
import connectDB from "./db/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use("/auth/api", authroutes);

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
