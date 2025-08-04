require('dotenv').config();

const config = {
    PORT: process.env.PORT || 5050,
    URL_BACKEND: process.env.URL_BACKEND || 'http://localhost:4040'
};

module.exports = config; 