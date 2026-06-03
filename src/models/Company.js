const mongoose = require("mongoose");
const companySchema = new mongoose.Schema({
  companyId: { type: String, unique: true, required: true },
  name: String,
  role: String,
  package: Number,
  eligibleDepartments: [String],
  minimumCgpa: Number,
  driveDate: Date,
  status: { type: String, default: "upcoming" },
}, { timestamps: true });
module.exports = mongoose.model("Company", companySchema);