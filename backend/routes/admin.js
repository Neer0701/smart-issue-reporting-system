const router = require("express").Router();
const Issue = require("../models/Issue");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/analytics", auth, role("admin"), async (req, res) => {
  try {
    const total = await Issue.countDocuments();
    const submitted = await Issue.countDocuments({ status: "submitted" });
    const inProgress = await Issue.countDocuments({ status: "in_progress" });
    const resolved = await Issue.countDocuments({ status: "resolved" });

    const resolutionRate = total > 0 ? (resolved / total) * 100 : 0;

    res.json({
      totalIssues: total,
      submitted,
      inProgress,
      resolved,
      resolutionRate: resolutionRate.toFixed(2) + "%"
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
