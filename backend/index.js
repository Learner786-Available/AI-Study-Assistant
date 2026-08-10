require("dotenv").config();

const dns = require("dns");

// Force Node.js to use Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const chatRoutes = require("./routes/chatRoutes");
const quizRoutes = require("./routes/quizRoutes");
const historyRoutes = require("./routes/historyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const noteRoutes = require("./routes/noteRoutes");
const chatHistoryRoutes = require("./routes/chatHistoryRoutes");
const authRoutes = require("./routes/authRoutes");
const progressRoutes = require("./routes/progressRoutes");
const passport = require("./config/passport");

const app = express();
const uploadsDir = path.join(__dirname, "uploads");
const profileUploadsDir = path.join(uploadsDir, "profile");

fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(profileUploadsDir, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(passport.initialize());

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/chat-history", chatHistoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);

// Home Route
app.get("/", (req, res) => {

    res.send("AI Study Assistant Backend Running 🚀");

});

const { chatWithGemini } = require("./services/geminiService");

app.get("/test-ai", async (req, res) => {
    try {
        const reply = await chatWithGemini("Say Hello");

        res.json({
            success: true,
            reply
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }
});

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});