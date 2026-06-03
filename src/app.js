const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const syncRoutes = require("./routes/syncRoutes");
const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const driveRoutes = require("./routes/driveRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Placement Recruitment API Running" });
});

app.get("/health", async (req, res) => {
  try {
    const Student = require("./models/Student");
    const count = await Student.countDocuments();
    res.json({
      success: true,
      message: "Database connected successfully",
      data: {
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        documentCount: count,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.use("/auth", authRoutes);
app.use("/sync", syncRoutes);
app.use("/students", studentRoutes);
app.use("/companies", companyRoutes);
app.use("/drives", driveRoutes);
app.use("/applications", applicationRoutes);
app.use("/interviews", interviewRoutes);
app.use("/analytics", analyticsRoutes);

module.exports = app;