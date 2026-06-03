const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
  applicationId: { type: String, unique: true, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  drive: { type: mongoose.Schema.Types.ObjectId, ref: "Drive" },
  currentRound: { type: String, default: "Applied" },
  status: { type: String, default: "applied" },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });
module.exports = mongoose.model("Application", applicationSchema);