import express, { Router } from "express";

const route = express.Router();

route.get("/login", (req, res) => {
  res.send("this is loging route!");
});

export default route;
