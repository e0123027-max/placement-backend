const mongoose = require("mongoose");
const interviewSchema = new mongoose.Schema({
  interviewId: { type: String, unique: true, required: true },
  application: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  interviewer: String,
  round: String,
  interviewDate: Date,
  status: { type: String, default: "scheduled" },
  result: { type: String, enum: ["pending", "pass", "fail"], default: "pending" },
  feedback: { type: String, default: "" },
}, { timestamps: true });
module.exports = mongoose.model("Interview", interviewSchema);