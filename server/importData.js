const mongoose = require('mongoose');
const Quote = require('./models/Quote');
require('dotenv').config();


const importData = async()=>{
    try{
        // load data from quote.json
        const quotesData = require('./quotes.json');
        const mongoUrl = process.env.MONGO_URI;

        if (!mongoUrl) {
            throw new Error('MONGO_URI is missing. Add it in server/.env before import.');
        }

        // connect to mongoDb
        await mongoose.connect(mongoUrl);

        // insert quotesdata in db
        await Quote.insertMany(quotesData, { ordered: false });
        
        console.log('Data imported in Db successfully...');
        process.exit();
    }catch(error){
        if (error?.code === 11000 && error?.result?.insertedCount > 0) {
            console.log(`Data imported with duplicates skipped. Inserted ${error.result.insertedCount} quotes.`);
            process.exit(0);
        }

        console.error('Error Importing data...',error);
        process.exit(1);
    }
};

importData();
