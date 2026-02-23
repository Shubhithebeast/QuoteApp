const mongoose = require('mongoose');
const Quote = require('./models/Quote');


const importData = async()=>{
    try{
        // load data from quote.json
        const quotesData = require('./quotes.json');

        // connect to mongoDb
        await mongoose.connect('mongodb+srv://shubham:cluster123@quotescluster.d4ao3ui.mongodb.net/quotes_db?retryWrites=true&w=majority',{
            useNewUrlParser:true, useUnifiedTopology:true
        });

        // insert quotesdata in db
        await Quote.insertMany(quotesData);
        
        console.log('Data imported in Db successfully...');
        process.exit();
    }catch(error){
        console.error('Error Importing data...',error);
        process.exit(1);
    }
};

importData();