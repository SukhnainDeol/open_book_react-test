const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const path = require('path')


// SERVER
const app = express()
const port = 8080;


// MIDDLEWARE
app.use(cors())
app.use(express.json())


// MONGODB
const uri = process.env.REACT_APP_ATLAS_URI; // CONNECTION SHOULD BE PLACED IN .env FILE

// connect to MongoDB Atlas Cluster
mongoose.connect(uri,{
    dbName: 'openBook', // name of database
}).then(() => { 
     
    console.log("Database connection established successfully!");

    // once the connection is open, give message letting us know it was connected!
    mongoose.connection.once('open', () => { 
        console.log("database connection established successfully!");
    });
    
}).catch((err) => {
    console.log("Database connection FAILED! ", err);
})

// API ROUTE FILES
const usersRouter = require('./routes/users.route')
app.use('/users', usersRouter)

const postsRouter = require('./routes/posts.route')
app.use('/posts', postsRouter)

const eRouter = require('./routes/encrypt.route')
app.use('/encrypt', eRouter)


// Serve static files from the React app's dist directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle all other routes by serving the index.html file from the dist directory
app.get('*', (req, res) => {
    console.log("GOT A REQUEST FOR PAGE");
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});


// SERVER METHODS
app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on 0.0.0.0 at PORT: ${port}`);
})