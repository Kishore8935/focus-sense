import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    focusedTime: { type: Number, default: 0 },
    distractedTime: { type: Number, default: 0 },
    awayTime: { type: Number, default: 0 },

    startTime: { type: Date, default: Date.now },
    endTime: Date,

    focusPercentage: Number
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
