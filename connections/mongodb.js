const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const database = client.db("testhigo");

module.exports = { client, database };
