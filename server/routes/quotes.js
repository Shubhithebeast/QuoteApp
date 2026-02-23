const express = require('express');
const router = express.Router();
const axios = require('axios');
const Quote = require('../models/Quote');

// fetch all data -> just for debugging
router.get('/',async (req,res)=>{
    try{
        const response = await Quote.find();
        res.json(response);
    }catch(error){
        console.error(error);
        res.status(400).send('Server Error...');
    }
})

// Fetch random quote
router.get('/random',async(req,res)=>{
    try{
        // const response = await axios.get('https://zenquotes.io/api/random');
        // res.json(response.data);

        // data fetching from db then displayed
        const response = await Quote.aggregate([{$sample: {size:1}}]);
        res.json(response);
    }catch(error){ 
        console.error(error);
        res.status(400).send('Server Error...');
    }
}) 
 
// Fetch by author name
router.get('/search/:author', async(req,res)=>{
    const author = req.params.author;
    try{
        // const response = await axios.get(`https://zenquotes.io/api/quotes/author/${author}`);
        // res.json(response.data);

        const response = await Quote.findOne({author :{ $regex: new RegExp(author, 'i') }});
        res.json(response);
    }catch(error){ 
        console.error(error);
        res.status(400).send('Server Error...'); 
    }
})


// commenting it, bcz here we are fetching data from db instead of another api so don't have add data in db 
// router.post('/addQuote', async(req,res)=>{
//     const {text,author} = req.body;

//     try{
//         // add quote and author name in database, in collection quote
//         const new_quote = new Quote({text,author});
//         await new_quote.save();
//         console.log("Quote successfully added in db...");
//         res.json({success:true, message:"Quote successfully added..."});
//     }catch(error){
//         console.error(error);
//         res.status(400).json({success:false, message:"Failed to save quote..."});
//     }
// })

module.exports=router;