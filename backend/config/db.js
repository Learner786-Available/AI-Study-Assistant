const mongoose = require("mongoose");

async function connectDB() {
  try {
    console.log(process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("ERROR NAME:", err.name);
    console.error("ERROR MESSAGE:", err.message);
    console.error(err);
    process.exit(1);
  }
}

module.exports = connectDB;