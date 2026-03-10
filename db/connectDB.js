import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected");
  } catch (err) {
    console.log(`Error in connectDB: ${err}`);
    process.exit(1); // this is for stopping the server if there are any error in db connection to prevent from the unpredictabe behaviour
  }
};

export default connectDB;
