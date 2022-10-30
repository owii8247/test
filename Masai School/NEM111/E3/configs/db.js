const mongoose = require("mongoose")
require("dotenv").config()
console.log(process.env.mongo_url)
const connection = mongoose.connect(process.env.mongo_url)

module.exports = connection
