const mongoose = require('mongoose')
require('dotenv').config()
const URI = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.xfphf.mongodb.net/${process.env.DB_NAME}`
mongoose.connect(URI);

module.exports = mongoose;