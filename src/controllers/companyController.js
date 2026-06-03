const Company = require("../models/Company");

exports.create = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, message: "Company created successfully", data: company });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const total = await Company.countDocuments();
    const data = await Company.find();
    res.json({ success: true, message: "Companies fetched successfully", total, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, message: "Company fetched successfully", data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, message: "Company updated successfully", data: company });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};