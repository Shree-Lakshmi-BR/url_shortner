const express = require('express');
const router = express.Router();
const { isUri } = require('valid-url');
const { generate } = require('shortid');
const Url = require('../models/Url');

router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  // Check if the URL is valid
  const isValidUrl = isUri(originalUrl);
  if (isValidUrl) {
    // Check if the URL already exists in the database
    let url = await Url.findOne({ originalUrl });
    if (url) {
      res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}` });
    } else {
      // Generate a unique short code
      const shortCode = generate();
      // Create a new URL document
      url = new Url({ originalUrl, shortCode });
      // Save the URL document to the database
      await url.save();
      res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}` });
    }
  } else {
    res.status(400).json({ error: 'Invalid URL' });
  }
});

router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  // Find the URL document in the database
  const url = await Url.findOne({ shortCode });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

module.exports = router;
