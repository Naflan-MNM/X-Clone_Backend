import express from "express";
import cloudinary from "cloudinary";
import User from "../model/schema/UserSchema.js";

const createPost = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    let img = req.body.img;
    const text = req.body.text;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (!text && !img) {
      return res.status(400).json({
        error: "Post must contain text or an image.",
      });
    }

    if (img) {
      const postImg = await cloudinary.uploader.upload(img);
      img = postImg.secure_url;
    }
    const newPost = new Post({
      user: userId,
      img,
      text,
    });
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    console.error(`Error in creatPost controller: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createPost };
