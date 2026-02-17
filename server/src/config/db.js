import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Single shared DB connection for API + Socket event handlers.
    await mongoose.connect(
      process.env.MONGO_URI,
    {
      dbName : process.env.DB_NAME || "collabDB"
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection error", error);
    // In tests we throw so Jest can fail fast with a clear error.
    if (process.env.NODE_ENV === "test") {
      throw error;
    }
    // In runtime, fail startup instead of running a half-alive API.
    process.exit(1);
  }
};
