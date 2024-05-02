const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()


// SERVER
const app = express()
const port = process.env.REACT_APP_PORT || 5000;


// MIDDLEWARE
app.use(cors())
app.use(express.json())


// MONGODB
const uri = process.env.REACT_APP_ATLAS_URI; // CONNECTION SHOULD BE PLACED IN .env FILE
mongoose.connect(uri)

const connection = mongoose.connection;
connection.once('open', () => { // once the connection is open, give message letting us know it was connected!
    console.log("database connection established successfully!");
});


// API ROUTE FILES
const usersRouter = require('./routes/users.route')
app.use('/users', usersRouter)

const postsRouter = require('./routes/posts.route')
app.use('/posts', postsRouter)


// SERVER METHODS
app.listen(port, () => {
    console.log(`Server started on PORT: ${port}`);
})