import User from "../model/schema/UserSchema.js";
import Notification from "../model/notification.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import validator from "validator";

const getProfile = async (req, res) => {
  try {
    console.log("USERNAME PARAM:", req.params.username);
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    console.log("FOUND USER:", user);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    return res.status(201).json(user);
  } catch (error) {
    console.error(`error from getProfile controller: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

const followUnFollowUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById({ _id: id });
    const currentUser = await User.findById({ _id: req.user._id });
    if (id === req.user._id) {
      return res
        .status(400)
        .json({ error: "you can`t follow/unfollow yourself" });
    }
    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "user not found" });
    }
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      //unfollow
      await User.findByIdAndUpdate(
        { _id: id },
        { $pull: { followers: req.user._id } },
      );
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $pull: { following: id } },
      );
      res.status(200).json({ message: "Unfollow Successfully" }); //this is only for testing,but in prectiece we don't send res like this
    } else {
      //follow
      await User.findByIdAndUpdate(
        { _id: id },
        { $push: { followers: req.user._id } },
      );
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $push: { following: id } },
      );
      //send notfication
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: id,
      });
      await newNotification.save();
      res.status(200).json({ message: "following Successfully" }); //this is only for testing,but in prectiece we don't send res like this
    }
  } catch (error) {
    console.error(`error from followUnFollowUsers controller: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const currentUser = await User.findById(userId);

    const suggestedUsers = await User.find({
      _id: {
        $ne: userId,
        $nin: currentUser.following, // exclude already followed
      },
    }).limit(10);
    suggestedUsers.forEach((user) => {
      user.password = null;
    });

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error(`error from suggestedUser controller: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userid = req.user._id;
    if (!userid) {
      return res.status(400).json({ erros: "user not found" });
    }
    let currentUser = await User.findById(userid);
    let {
      fullname,
      email,
      currentPassword,
      newPassword,
      bio,
      link,
      profileImage,
      coverImage,
    } = req.body;
    if (newPassword || currentPassword) {
      if (!currentPassword && newPassword) {
        return res
          .status(400)
          .json({ error: "pleace provide Current Password" });
      }
      if (!newPassword && currentPassword) {
        return res.status(400).json({ error: "pleace provide New Password" });
      }
      const isMatchPassword = await bcrypt.compare(
        currentPassword,
        currentUser.password,
      );
      if (!isMatchPassword) {
        return res.status(400).json({ error: "Invalid Password" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters",
        });
      }
    }
    const updatePassword = async (req, res) => {
      const newhashPassword = await bcrypt.hash(req.password, 10);
      currentUser.password = newhashPassword || currentUser.password;
    };
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        error: "Please enter a valid email address",
      });
    }

    if (profileImage) {
      if (currentUser.profileimage) {
        //the cloudinary secure_url will be look like https://res.cloudinary.com/jhgfuo5j/image/upload/v1254879995/cld-sample-5.jpg
        /*from here we need that path name which is 'cld-sample-5' to get that you used the below code snipet*/
        await cloudinary.uploader.destroy(
          currentUser.profileimage.split("/").pop().split(".")[0],
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImage);
      const newProfileImgUrl = uploadedResponse.secure_url;
      currentUser.profileImage = newProfileImgUrl || currentUser.profileImage;
    }

    if (coverImage) {
      if (currentUser.coverImage) {
        await cloudinary.uploader.destroy(
          currentUser.coverImage.split("/").pop().split(".")[0],
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImage);
      const newCoverImageUrl = uploadedResponse.secure_url;
      currentUser.coverImage = newCoverImageUrl || currentUser.coverImage;
    }

    currentUser.fullname = fullname || currentUser.fullname;
    currentUser.email = email || currentUser.email;
    currentUser.bio = bio || currentUser.bio;
    currentUser.link = link || currentUser.link;

    currentUser = await currentUser.save();
    currentUser.password = null;
    return res.status(200).json(currentUser);
  } catch (error) {
    console.error(`error from updateUser controller: ${error}`);
    res.status(500).json({ error: "iternal server error" });
  }
};

export { getProfile, followUnFollowUsers, getSuggestedUser, updateUser };
