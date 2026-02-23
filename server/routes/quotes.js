const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

const buildQuotePayload = (quote) => ({
    id: quote._id,
    text: quote.text,
    author: quote.author || "Unknown",
});

// fetch all quotes (debug / admin)
router.get('/', async (req, res) => {
    try {
        const quotes = await Quote.find().select('text author').limit(200);
        const payload = quotes.map(buildQuotePayload);
        res.json({ success: true, count: payload.length, data: payload });
    } catch (error) {
        console.error('Failed to fetch quotes', error);
        res.status(500).json({ success: false, message: 'Failed to fetch quotes.' });
    }
});

// Fetch random quote
router.get('/random', async (req, res) => {
    try {
        const randomQuote = await Quote.aggregate([{ $sample: { size: 1 } }]);
        if (!randomQuote.length) {
            return res.status(404).json({ success: false, message: 'No quotes found.' });
        }

        res.json({ success: true, data: buildQuotePayload(randomQuote[0]) });
    } catch (error) {
        console.error('Failed to fetch random quote', error);
        res.status(500).json({ success: false, message: 'Failed to fetch random quote.' });
    }
});

// Fetch by author name
router.get('/search/:author', async (req, res) => {
    const author = req.params.author?.trim();
    if (!author) {
        return res.status(400).json({ success: false, message: 'Author is required.' });
    }

    try {
        const escapedAuthor = author.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const quotes = await Quote.find({
            author: { $regex: new RegExp(escapedAuthor, 'i') },
        }).select('text author');

        if (!quotes.length) {
            return res.status(404).json({ success: false, message: `No quotes found for "${author}".` });
        }

        const randomMatch = quotes[Math.floor(Math.random() * quotes.length)];
        res.json({
            success: true,
            count: quotes.length,
            data: buildQuotePayload(randomMatch),
        });
    } catch (error) {
        console.error('Failed to search quotes by author', error);
        res.status(500).json({ success: false, message: 'Failed to search quotes.' });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const [totalQuotes, totalAuthors] = await Promise.all([
            Quote.countDocuments(),
            Quote.distinct('author').then((authors) => authors.filter(Boolean).length),
        ]);

        res.json({
            success: true,
            data: { totalQuotes, totalAuthors },
        });
    } catch (error) {
        console.error('Failed to fetch stats', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
    }
});

module.exports = router;
