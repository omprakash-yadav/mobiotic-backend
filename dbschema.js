var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
let dbName = "mobiotic";
let dbUrl = `mongodb+srv://opyadav:Op1217322@cluster0.lcp7x.mongodb.net/test${dbName}`;
module.exports = { mongodb, dbUrl, MongoClient };