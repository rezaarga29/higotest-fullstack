const { getUserCollection } = require("../connections/collections");
const { calculateAge } = require("./summaryModel");

// Fungsi untuk mengambil data pengguna dari database
async function getUsers() {
  const collection = await getUserCollection();
  return collection.find().toArray();
}

// Fungsi untuk menghitung data segmentasi
async function calculateSegmentationData() {
  const users = await getUsers();

  const ageGroups = [
    "< 18",
    "18 - 24",
    "25 - 34",
    "35 - 44",
    "45 - 64",
    "> 64",
  ];
  const genderGroups = ["Male", "Female", "Other"];
  const phoneBrands = ["Apple", "Samsung", "Xiaomi", "Huawei", "Other"];
  const digitalInterests = [
    "Social Media",
    "News",
    "Shopping",
    "Music",
    "Other",
  ];

  let ageGroupCounts = Array.from({ length: ageGroups.length }, () => 0);
  let genderGroupCounts = Array.from({ length: genderGroups.length }, () => 0);
  let phoneBrandCounts = Array.from({ length: phoneBrands.length }, () => 0);
  let digitalInterestCounts = Array.from(
    { length: digitalInterests.length },
    () => 0
  );

  users.forEach((user) => {
    // Age Group
    let age = calculateAge(user.Age); // Menggunakan tahun lahir dari data
    if (age < 18) {
      ageGroupCounts[0]++;
    } else if (age >= 18 && age <= 24) {
      ageGroupCounts[1]++;
    } else if (age >= 25 && age <= 34) {
      ageGroupCounts[2]++;
    } else if (age >= 35 && age <= 44) {
      ageGroupCounts[3]++;
    } else if (age >= 45 && age <= 64) {
      ageGroupCounts[4]++;
    } else {
      ageGroupCounts[5]++;
    }

    // Gender
    if (user.gender === "Male") {
      genderGroupCounts[0]++;
    } else if (user.gender === "Female") {
      genderGroupCounts[1]++;
    } else {
      genderGroupCounts[2]++;
    }

    // Phone Brand
    if (phoneBrands.includes(user["Brand Device"])) {
      const index = phoneBrands.indexOf(user["Brand Device"]);
      phoneBrandCounts[index]++;
    } else {
      phoneBrandCounts[phoneBrands.length - 1]++; // Other category
    }

    // Digital Interest
    if (digitalInterests.includes(user["Digital Interest"])) {
      const index = digitalInterests.indexOf(user["Digital Interest"]);
      digitalInterestCounts[index]++;
    } else {
      digitalInterestCounts[digitalInterests.length - 1]++; // Other category
    }
  });

  // Convert counts to percentages
  const totalUsers = users.length;
  const ageGroupPercentages = ageGroupCounts.map((count) =>
    ((count / totalUsers) * 100).toFixed(2)
  );
  const genderGroupPercentages = genderGroupCounts.map((count) =>
    ((count / totalUsers) * 100).toFixed(2)
  );
  const phoneBrandPercentages = phoneBrandCounts.map((count) =>
    ((count / totalUsers) * 100).toFixed(2)
  );
  const digitalInterestPercentages = digitalInterestCounts.map((count) =>
    ((count / totalUsers) * 100).toFixed(2)
  );

  return {
    ageGroupPercentages: ageGroups.map((group, index) => ({
      group,
      percentage: ageGroupPercentages[index],
    })),
    genderGroupPercentages: genderGroups.map((group, index) => ({
      group,
      percentage: genderGroupPercentages[index],
    })),
    phoneBrandPercentages: phoneBrands.map((brand, index) => ({
      brand,
      percentage: phoneBrandPercentages[index],
    })),
    digitalInterestPercentages: digitalInterests.map((interest, index) => ({
      interest,
      percentage: digitalInterestPercentages[index],
    })),
  };
}

module.exports = {
  getUsers,
  calculateSegmentationData,
};
