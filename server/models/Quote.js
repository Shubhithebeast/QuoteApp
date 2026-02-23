const mongoose = require("mongoose");


// structuring schema
const QuoteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        unique: true, // no repeated quotes add on db
    },
    author: {
        type: String,
        default: "Unknown",
        trim: true,
    }
});
// creating a model from the schema
module.exports = mongoose.model('Quote',QuoteSchema);

 
