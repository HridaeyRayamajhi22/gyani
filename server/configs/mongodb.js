import mongoose from "mongoose";

// Connect to mongoDb database

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database Connected"));

  await mongoose.connect(`${process.env.MONGODB_URI}/gyani`);

};

export default connectDB;
