const Application = require("../models/Application");
const Student = require("../models/Student");
const Drive = require("../models/Drive");
const Company = require("../models/Company");

exports.create = async (req, res) => {
  try {
    const { student: studentId, drive: driveId } = req.body;
    const student = await Student.findById(studentId);
    const drive = await Drive.findById(driveId).populate("company");
    if (!student || !drive) return res.status(404).json({ success: false, message: "Student or Drive not found" });

    if (drive.status === "closed") return res.status(400).json({ success: false, message: "Closed drives cannot accept applications" });
    if (drive.company && student.cgpa < drive.company.minimumCgpa)
      return res.status(400).json({ success: false, message: "CGPA below company minimum" });
    if (drive.company && !drive.company.eligibleDepartments.includes(student.department))
      return res.status(400).json({ success: false, message: "Department not eligible" });
    const dup = await Application.findOne({ student: studentId, drive: driveId });
    if (dup) return res.status(409).json({ success: false, message: "Duplicate application" });

    const application = await Application.create(req.body);
    res.status(201).json({ success: true, message: "Application created successfully", data: application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let query = Application.find(filter)
      .populate({ path: "student", select: "studentId name department" })
      .populate({ path: "drive", populate: { path: "company" } });

    let data = await query;
    if (search) {
      data = data.filter(a => a.drive?.company?.name?.toLowerCase().includes(search.toLowerCase()));
    }
    const total = data.length;
    const start = (page - 1) * limit;
    const paged = data.slice(start, start + Number(limit));

    res.json({
      success: true,
      message: "Applications fetched successfully",
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: paged,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("student")
      .populate({ path: "drive", populate: { path: "company" } });
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    res.json({ success: true, message: "Application fetched successfully", data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    res.json({ success: true, message: "Application updated successfully", data: application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    res.json({ success: true, message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};