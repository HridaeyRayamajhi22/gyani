import express from "express";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: string, required: true },
    name: { type: string, required: true },
    email: { type: string, required: true },
    imageUrl: { type: string, required: true },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
