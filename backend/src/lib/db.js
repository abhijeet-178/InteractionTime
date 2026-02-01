import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    throw error; // IMPORTANT: let server.js handle shutdown
  }
};
