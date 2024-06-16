const { getUserCollection } = require("../connections/collections");

async function getUsers() {
  const collection = await getUserCollection();
  return collection.find().toArray();
}

async function calculateSummary() {
  try {
    const users = await getUsers();

    let dailyUniqueUsers = {};
    let totalUniqueUsers = new Set();
    let newReturningPerDay = {};
    let totalNewReturning = { new: 0, returning: 0 };
    let busiestDay = null;
    let busiestHour = null;
    let totalDataCount = users.length;

    let dayUserMap = {};
    let hourUserMap = {};
    let seenUsers = new Set();
    let seenUsersPerDay = {};

    users.sort((a, b) => {
      const dateA = new Date(`${a.Date} ${a["Login Hour"]}`);
      const dateB = new Date(`${b.Date} ${b["Login Hour"]}`);
      return dateA - dateB;
    });

    users.forEach((user) => {
      let day = user.Date;
      let hour = user["Login Hour"];
      let email = user.Email;

      if (!dailyUniqueUsers[day]) {
        dailyUniqueUsers[day] = new Set();
      }
      dailyUniqueUsers[day].add(email);

      totalUniqueUsers.add(email);

      if (!dayUserMap[day]) {
        dayUserMap[day] = 0;
      }
      dayUserMap[day]++;

      if (!hourUserMap[hour]) {
        hourUserMap[hour] = 0;
      }
      hourUserMap[hour]++;

      if (!newReturningPerDay[day]) {
        newReturningPerDay[day] = { new: 0, returning: 0 };
      }

      if (!seenUsersPerDay[day]) {
        seenUsersPerDay[day] = new Set();
      }

      if (seenUsers.has(email)) {
        if (!seenUsersPerDay[day].has(email)) {
          newReturningPerDay[day].returning++;
          totalNewReturning.returning++;
          seenUsersPerDay[day].add(email);
        }
      } else {
        newReturningPerDay[day].new++;
        totalNewReturning.new++;
        seenUsers.add(email);
        seenUsersPerDay[day].add(email);
      }
    });

    busiestDay = Object.keys(dayUserMap).reduce((a, b) =>
      dayUserMap[a] > dayUserMap[b] ? a : b
    );

    busiestHour = Object.keys(hourUserMap).reduce((a, b) =>
      hourUserMap[a] > hourUserMap[b] ? a : b
    );

    let dailyUniqueUsersCount = {};
    Object.keys(dailyUniqueUsers).forEach((day) => {
      dailyUniqueUsersCount[day] = dailyUniqueUsers[day].size;
    });

    return {
      dailyUniqueUsers: dailyUniqueUsersCount,
      totalUniqueUsers: totalUniqueUsers.size,
      newReturningPerDay,
      totalNewReturning,
      busiestDay,
      busiestHour,
      totalDataCount,
    };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to calculate summary");
  }
}

function calculateAge(birthYear) {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

module.exports = {
  calculateSummary,
  calculateAge,
};
