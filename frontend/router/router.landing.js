const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const URL_BACKEND = process.env.URL_BACKEND || 'http://localhost:4040';

router.get('/', async (req, res) => {
    try {
            res.render('pages/landing');
        
    } catch (error) {
        res.render('pages/error500');
    }
});

module.exports = router;