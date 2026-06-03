const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, required: true },
  name: String,
  email: { type: String, unique: true },
  department: String,
  cgpa: Number,
  skills: [String],
  graduationYear: Number,
  phone: String,
  status: { type: String, default: "active" },
}, { timestamps: true });
module.exports = mongoose.model("Student", studentSchema);