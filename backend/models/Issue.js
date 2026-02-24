const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  status: {
    type: String,
    enum: ["submitted", "in_progress", "resolved"],
    default: "submitted"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low"
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  category: {
type: String,
enum: [ "infrastructure", "sanitation",
"electricity", "water", "traffic",
"public_safety", "environment", "others"],
required: true
}
}, { timestamps: true });

module.exports = mongoose.model("Issue", issueSchema);
