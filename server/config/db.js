const mongoose = require('mongoose');
require("dotenv").config();
const mongo_url = process.env.MONGO_URI; 

const mongodb = async () => {
    if (!mongo_url) {
        throw new Error("MONGO_URI is missing. Add it in server/.env");
    }

    try {
        await mongoose.connect(mongo_url);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Error connecting database", error);
        process.exit(1);
    }
}

module.exports = mongodb;
