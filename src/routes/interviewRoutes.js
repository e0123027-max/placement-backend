const express = require("express");
const { create, update } = require("../controllers/interviewController");
const { protect, allowRoles } = require("../middleware/auth");
const router = express.Router();
router.post("/", protect, allowRoles("admin", "placement_officer"), create);
router.patch("/:id", protect, allowRoles("admin", "placement_officer"), update);
module.exports = router;