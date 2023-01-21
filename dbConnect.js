const mongoose = require('mongoose')
require("dotenv").config()

const URL = process.env.MONGO_URL;

mongoose.connect(URL)


let connectionObj = mongoose.connection;

connectionObj.on('connected', () => {
    console.log('Mongo DB Connection Successfull');
})

connectionObj.on('error', () => {
    console.log('Mongo DB Connection Failed')
})




