import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: String,

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
