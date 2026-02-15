import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    title: String,
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
    position: Number,
  },
  { timestamps: true }
);

export default mongoose.model("List", listSchema);
