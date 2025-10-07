const express = require('express');
const router = express.Router();
const { createPreference } = require('../controller/mercadopago.controller');

router.post('/create_preference', createPreference);

module.exports = router;
