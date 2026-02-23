const mongoose = require('mongoose');
require("dotenv").config();
const mongo_url = process.env.MONGO_URI; 

const mongodb = async () => {
    try {
        await mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Error connecting database", error);
    }
}

module.exports = mongodb;
