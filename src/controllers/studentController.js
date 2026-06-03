const Student = require("../models/Student");

exports.getAll = async (req, res) => {
  try {
    const { department, cgpaMin, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (department) filter.department = department.toUpperCase();
    if (cgpaMin) filter.cgpa = { $gte: Number(cgpaMin) };
    if (status) filter.status = status;

    const total = await Student.countDocuments(filter);
    const data = await Student.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      message: "Students fetched successfully",
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, message: "Student fetched successfully", data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};