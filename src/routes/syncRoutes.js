const express = require("express");
const { sync } = require("../controllers/syncController");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();
router.post("/", protect, allowRoles("admin", "placement_officer"), sync);

module.exports = router;