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
    set: process.env.SET,
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

const safeDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

const sanitizeStudent = (s) => ({
  ...s,
  name: s.name?.trim(),
  email: s.email?.toLowerCase().trim(),
  department: s.department?.toUpperCase().trim(),
});

const isValidStudent = (s) =>
  s && s.studentId && s.name && s.email && s.department &&
  typeof s.cgpa === "number" && s.cgpa >= 0 && s.cgpa <= 10;

const syncAll = async () => {
  const response = await fetchDataset();
  const data = response.data;
  const result = { students: 0, companies: 0, drives: 0, applications: 0, interviews: 0 };

  // Students
  if (Array.isArray(data.students)) {
    for (const raw of data.students) {
      try {
        if (!isValidStudent(raw)) continue;
        const s = sanitizeStudent(raw);
        const exists = await Student.findOne({ studentId: s.studentId });
        if (exists) continue;
        await Student.create(s);
        result.students++;
      } catch (e) { continue; }
    }
  }

  // Companies
  if (Array.isArray(data.companies)) {
    for (const c of data.companies) {
      try {
        if (!c.companyId || !c.name) continue;
        const exists = await Company.findOne({ companyId: c.companyId });
        if (exists) continue;
        const cleaned = { ...c, driveDate: safeDate(c.driveDate) };
        await Company.create(cleaned);
        result.companies++;
      } catch (e) { continue; }
    }
  }

  // Drives
  if (Array.isArray(data.drives)) {
    for (const d of data.drives) {
      try {
        if (!d.driveId) continue;
        const exists = await Drive.findOne({ driveId: d.driveId });
        if (exists) continue;
        const company = await Company.findOne({ companyId: d.companyId });
        const cleaned = {
          ...d,
          company: company?._id,
          registrationDeadline: safeDate(d.registrationDeadline),
        };
        await Drive.create(cleaned);
        result.drives++;
      } catch (e) { continue; }
    }
  }

  // Applications
  if (Array.isArray(data.applications)) {
    for (const a of data.applications) {
      try {
        if (!a.applicationId) continue;
        const exists = await Application.findOne({ applicationId: a.applicationId });
        if (exists) continue;
        const student = await Student.findOne({ studentId: a.studentId });
        const drive = await Drive.findOne({ driveId: a.driveId });
        if (!student || !drive) continue;
        const cleaned = {
          ...a,
          student: student._id,
          drive: drive._id,
          appliedAt: safeDate(a.appliedAt) || new Date(),
        };
        await Application.create(cleaned);
        result.applications++;
      } catch (e) { continue; }
    }
  }

  // Interviews
  if (Array.isArray(data.interviews)) {
    for (const i of data.interviews) {
      try {
        if (!i.interviewId) continue;
        const exists = await Interview.findOne({ interviewId: i.interviewId });
        if (exists) continue;
        const application = await Application.findOne({ applicationId: i.applicationId });
        if (!application) continue;
        const cleaned = {
          ...i,
          application: application._id,
          interviewDate: safeDate(i.interviewDate),
        };
        await Interview.create(cleaned);
        result.interviews++;
      } catch (e) { continue; }
    }
  }

  return result;
};

module.exports = { syncAll };