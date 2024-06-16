const UserModel = require("../models/userModel");

async function getUserData(req, res, next) {
  try {
    const top5UserData = await UserModel.getTop5UserDataPerLocation();
    res.json(top5UserData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
}

module.exports = {
  getUserData,
};
