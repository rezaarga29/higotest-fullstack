const { calculateSummary } = require("../models/summaryModel");

exports.getSummary = async (req, res) => {
  try {
    const summary = await calculateSummary();
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
