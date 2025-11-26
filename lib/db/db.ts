import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  const connection = mongoose.connection.readyState;

  if (connection === 1) {
    console.log("Mongodb is already connected ✅");
    return;
  }
  if (connection === 2) {
    console.log("Connecting...");
    return;
  }

  try {
    mongoose.connect(MONGODB_URL!, {
      dbName: "London-Academy",
      bufferCommands: true,
    });
    console.log("conected to Mongodb ✅");
  } catch (error) {
    console.log("Error Connected to Mongodb ❌");
    throw new Error("Error :" + error);
  }
};

export default connectDB;
