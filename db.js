require("./usermgr/schema/user");
const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const dbURI = process.env.DB_URL;

const options = {
    reconnectTries: Number.MAX_VALUE,
    poolSize: 10
};

mongoose
    .connect(dbURI, options)
    .then(
        () => {
            console.log("Database connection established!");
        },
        err => {
            console.log("Error connecting Database instance due to: ", err);
        }
    );
const client = new MongoClient(dbURI, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});