import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: String,

    message: String,

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
