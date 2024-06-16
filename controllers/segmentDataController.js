const { calculateSegmentationData } = require("../models/segmentDataModel");

exports.getSegmentData = async (req, res) => {
  try {
    const segmentationData = await calculateSegmentationData();
    res.json(segmentationData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
