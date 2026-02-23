// importing modules
const express = require('express');
const cors = require("cors");
const connectDb = require('./config/db');

// creating instance of express
const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(cors()) // enabling cors for routes
app.use(express.json()) // parse incoming json data

connectDb();

app.use('/api',require('./routes/quotes'));

app.get("/", (req, res) => {
    res.send("Hiii, its working...");
})
// start server at PORT
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

