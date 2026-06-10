import User from "../model/schema/UserSchema.js";
import Notification from "../model/notification.model.js";
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

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error(`error: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getProfile, followUnFollowUsers, getSuggestedUser };
