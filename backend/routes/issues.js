const router = require("express").Router();
const Issue = require("../models/Issue");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  let priority = "low"

if (req.body.description.toLowerCase().includes("urgent")) {
  priority = "high"
} else if (req.body.description.length > 100) {
  priority = "medium"
}

const issue = await Issue.create({
  ...req.body,
  priority,
  reportedBy: req.user.id
})

  res.json(issue);
});

router.get("/", auth, async (req, res) => {

  try {

    let issues

    if (req.user.role === "admin") {
      issues = await Issue.find()
    } else {
      issues = await Issue.find({ reportedBy: req.user.id })
    }

    res.json(issues)

  } catch (err) {
    res.status(500).json({ msg: "Server error" })
  }

})

module.exports = router;

router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["submitted", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ msg: "Issue not found" });
    }

    issue.status = status;
    await issue.save();

    res.json(issue);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id/priority", auth, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" })
  }

  try {

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { priority: req.body.priority },
      { new: true }
    )

    res.json(issue)

  } catch (err) {
    res.status(500).json({ msg: "Server error" })
  }

})
