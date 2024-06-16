const { database } = require("./mongodb");

const getUserCollection = () => {
  return database.collection("users");
};

module.exports = { getUserCollection };
