const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState >= 1) {
    return cached.conn;
  }

  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb+srv://carrier-pilot:admin123@cluster0.kkdvuh4.mongodb.net/sgip_db?retryWrites=true&w=majority";

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log("MongoDB connected successfully");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection failed:", e.message);
    throw e;
  }
};

module.exports = connectDB;