const mongoose = require("mongoose");


// structuring schema
const QuoteSchema = new mongoose.Schema({
    text: {
        type: String,
        unique: true, // no repeated quotes add on db
    },
    author:String
})
// creating a model from the schema
module.exports = mongoose.model('Quote',QuoteSchema);

 