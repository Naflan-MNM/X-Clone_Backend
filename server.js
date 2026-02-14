import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/Routes.js";

dotenv.config();
const App = express();

const PORT = process.env.PORT || 3500;
App.use("/auth/api/", authroutes);
App.get("/", (req, res) => {
  res.send("hello world!");
});

App.listen(PORT, () => {
  console.log(`server running on the port number ${PORT}`);
});
