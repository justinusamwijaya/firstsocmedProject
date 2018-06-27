require('dotenv').config()
const express = require('express')
const app = express();
const cors = require('cors')
const routes = require('./routes')
const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.databasename}:${process.env.databasepassword}@ds221271.mlab.com:21271/namanyabebas`)

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({extended:false}))

app.use('', routes)


app.listen(3000,()=>{
    console.log('I am listening!')
})