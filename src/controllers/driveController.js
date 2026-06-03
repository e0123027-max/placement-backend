const Drive = require("../models/Drive");

exports.create = async (req, res) => {
  try {
    const drive = await Drive.create(req.body);
    res.status(201).json({ success: true, message: "Drive created successfully", data: drive });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { status, company } = req.query;
    const filter = {};
    if (status) filter.status = status;
    let data = await Drive.find(filter).populate("company");
    if (company) {
      data = data.filter(d => d.company?.name?.toLowerCase() === company.toLowerCase());
    }
    res.json({ success: true, message: "Drives fetched successfully", total: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id).populate("company");
    if (!drive) return res.status(404).json({ success: false, message: "Drive not found" });
    res.json({ success: true, message: "Drive fetched successfully", data: drive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!drive) return res.status(404).json({ success: false, message: "Drive not found" });
    res.json({ success: true, message: "Drive updated successfully", data: drive });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const drive = await Drive.findByIdAndDelete(req.params.id);
    if (!drive) return res.status(404).json({ success: false, message: "Drive not found" });
    res.json({ success: true, message: "Drive deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};