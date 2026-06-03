const express = require("express");
const { placements, departments, companies } = require("../controllers/analyticsController");
const router = express.Router();
router.get("/placements", placements);
router.get("/departments", departments);
router.get("/companies", companies);
module.exports = router;