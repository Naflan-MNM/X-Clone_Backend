import User from "../model/schema/UserSchema.js";

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
  /* try {
    console.log("ENTERED GET PROFILE");

    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");

    console.log("USER FOUND:", user);

    return res.json({ message: "Test working" });
  } catch (error) {
    console.error(error);
  } */
};

export { getProfile };
