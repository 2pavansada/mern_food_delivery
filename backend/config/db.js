import mongoose from "mongoose";

export const connectDB = async () => {
  // Check if connection is already established or connecting (essential for serverless)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("⚠️ MONGODB_URI is not defined in environment variables. Database connection skipped.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
  }
};
