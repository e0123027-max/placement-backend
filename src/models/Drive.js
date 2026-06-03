const mongoose = require("mongoose");
const driveSchema = new mongoose.Schema({
  driveId: { type: String, unique: true, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  title: String,
  mode: String,
  location: String,
  registrationDeadline: Date,
  rounds: [String],
  status: { type: String, default: "open" },
}, { timestamps: true });
module.exports = mongoose.model("Drive", driveSchema);