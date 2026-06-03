const Application = require("../models/Application");
const Student = require("../models/Student");
const Company = require("../models/Company");

exports.placements = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const shortlistedCount = await Application.countDocuments({ status: "shortlisted" });
    const selectedCount = await Application.countDocuments({ status: "selected" });
    const rejectedCount = await Application.countDocuments({ status: "rejected" });
    res.json({
      success: true,
      message: "Placement analytics fetched",
      data: { totalApplications, shortlistedCount, selectedCount, rejectedCount },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.departments = async (req, res) => {
  try {
    const students = await Student.find();
    const apps = await Application.find({ status: "selected" }).populate("student");
    const deptMap = {};
    students.forEach(s => { deptMap[s.department] = deptMap[s.department] || { total: 0, placed: 0 }; deptMap[s.department].total++; });
    apps.forEach(a => { if (a.student) deptMap[a.student.department].placed++; });
    const data = Object.keys(deptMap).map(d => ({
      department: d,
      placedCount: deptMap[d].placed,
      placementPercentage: ((deptMap[d].placed / deptMap[d].total) * 100).toFixed(2),
    }));
    res.json({ success: true, message: "Department analytics fetched", data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.companies = async (req, res) => {
  try {
    const companies = await Company.find();
    const data = [];
    for (const c of companies) {
      const drives = await require("../models/Drive").find({ company: c._id });
      const driveIds = drives.map(d => d._id);
      const apps = await Application.find({ drive: { $in: driveIds } });
      const selected = apps.filter(a => a.status === "selected").length;
      data.push({
        _id: c._id,
        companyName: c.name,
        highestPackage: c.package,
        participationCount: apps.length,
        selectedStudents: selected,
      });
    }
    res.json({ success: true, message: "Company analytics fetched", data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};