const express = require("express");
const { getSummary } = require("../controllers/summaryController");
const { getSegmentData } = require("../controllers/segmentDataController");
const { getUserData } = require("../controllers/userDataController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/api/summary", getSummary);
router.get("/api/segment-data", getSegmentData);
router.get("/api/user-data", getUserData);

module.exports = router;
