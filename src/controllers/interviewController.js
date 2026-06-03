const Interview = require("../models/Interview");
const Application = require("../models/Application");

exports.create = async (req, res) => {
  try {
    const application = await Application.findById(req.body.application);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    if (application.status === "rejected")
      return res.status(400).json({ success: false, message: "Rejected application cannot receive interview" });

    const interview = await Interview.create(req.body);
    res.status(201).json({ success: true, message: "Interview scheduled successfully", data: interview });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const allowed = ["pending", "pass", "fail"];
    if (req.body.result && !allowed.includes(req.body.result))
      return res.status(400).json({ success: false, message: "Invalid result" });

    const existing = await Interview.findById(req.params.id).populate("application");
    if (!existing) return res.status(404).json({ success: false, message: "Interview not found" });
    if (existing.application?.status === "selected")
      return res.status(400).json({ success: false, message: "Selected candidate cannot be rescheduled" });

    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate({ path: "application", populate: [{ path: "student" }, { path: "drive", populate: "company" }] });
    res.json({ success: true, message: "Interview updated successfully", data: interview });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};