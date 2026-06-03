const axios = require("axios");
const Student = require("../models/Student");
const Company = require("../models/Company");
const Drive = require("../models/Drive");
const Application = require("../models/Application");
const Interview = require("../models/Interview");

const getToken = async () => {
  const res = await axios.post(process.env.PUBLIC_API_URL, {
    studentId: process.env.STUDENT_ID,
    password: process.env.STUDENT_PASSWORD,
  });
  return res.data.token;
};

const fetchDataset = async () => {
  const token = await getToken();
  const res = await axios.get(process.env.PRIVATE_API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const isValidStudent = (s) =>
  s && s.studentId && s.name && s.email && s.department && typeof s.cgpa === "number" && s.cgpa >= 0 && s.cgpa <= 10;

const sanitize = (s) => ({
  ...s,
  name: s.name?.trim(),
  email: s.email?.toLowerCase().trim(),
  department: s.department?.toUpperCase().trim(),
});

const syncAll = async () => {
  const data = await fetchDataset();
  const result = { students: 0, companies: 0, drives: 0, applications: 0, interviews: 0 };

  // Students
  if (Array.isArray(data.students)) {
    for (const raw of data.students) {
      if (!isValidStudent(raw)) continue;
      const s = sanitize(raw);
      const exists = await Student.findOne({ studentId: s.studentId });
      if (exists) continue;
      await Student.create(s);
      result.students++;
    }
  }

  // Companies
  if (Array.isArray(data.companies)) {
    for (const c of data.companies) {
      if (!c.companyId || !c.name) continue;
      const exists = await Company.findOne({ companyId: c.companyId });
      if (exists) continue;
      await Company.create(c);
      result.companies++;
    }
  }

  // Drives
  if (Array.isArray(data.drives)) {
    for (const d of data.drives) {
      if (!d.driveId) continue;
      const exists = await Drive.findOne({ driveId: d.driveId });
      if (exists) continue;
      const company = await Company.findOne({ companyId: d.companyId });
      await Drive.create({ ...d, company: company?._id });
      result.drives++;
    }
  }

  // Applications
  if (Array.isArray(data.applications)) {
    for (const a of data.applications) {
      if (!a.applicationId) continue;
      const exists = await Application.findOne({ applicationId: a.applicationId });
      if (exists) continue;
      const student = await Student.findOne({ studentId: a.studentId });
      const drive = await Drive.findOne({ driveId: a.driveId });
      if (!student || !drive) continue;
      await Application.create({ ...a, student: student._id, drive: drive._id });
      result.applications++;
    }
  }

  // Interviews
  if (Array.isArray(data.interviews)) {
    for (const i of data.interviews) {
      if (!i.interviewId) continue;
      const exists = await Interview.findOne({ interviewId: i.interviewId });
      if (exists) continue;
      const application = await Application.findOne({ applicationId: i.applicationId });
      if (!application) continue;
      await Interview.create({ ...i, application: application._id });
      result.interviews++;
    }
  }

  return result;
};

module.exports = { syncAll };