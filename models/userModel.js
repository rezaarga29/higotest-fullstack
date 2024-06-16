const { getUserCollection } = require("../connections/collections");

let cachedUsers = null;

async function getUsers() {
  if (!cachedUsers) {
    const collection = await getUserCollection();
    cachedUsers = await collection.find().toArray();
  }
  return cachedUsers;
}

async function getTop5UserDataPerLocation() {
  try {
    const users = await getUsers();

    const locationMap = new Map();

    const uniqueUsersPerLocation = new Map();

    for (const user of users) {
      const location = user["Name of Location"];

      if (!uniqueUsersPerLocation.has(location)) {
        uniqueUsersPerLocation.set(location, new Set());
      }

      if (!uniqueUsersPerLocation.get(location).has(user.Email)) {
        uniqueUsersPerLocation.get(location).add(user.Email);

        if (!locationMap.has(location)) {
          locationMap.set(location, {
            locationName: location,
            count: 0,
            users: [],
          });
        }
        locationMap.get(location).count++;
        locationMap.get(location).users.push(user);
      }
    }

    const sortedLocations = [...locationMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const top5UserData = sortedLocations.reduce((acc, location) => {
      acc[location.locationName] = location.users.slice(0, 5).map((user) => ({
        name: user.Name,
        email: user.Email,
        location: user["Name of Location"],
        gender: user.Gender,
        noTelp: user["No Telp"],
        brandDevice: user["Brand Device"],
        digitalInterest: user["Digital Interest"],
      }));
      return acc;
    }, {});

    return top5UserData;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch top 5 user data per location");
  }
}

module.exports = {
  getTop5UserDataPerLocation,
};
