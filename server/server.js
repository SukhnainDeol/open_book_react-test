const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/userModel')


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

// SERVER METHODS

app.get("/api", (request, response) => {

    response.json({"users": ["testUser", "testSnoop"]})
})

app.listen(port, () => {
    console.log(`Server started on PORT: ${port}`);
})


// USER MODEL METHODS

// POST request for user
app.post("/users", async (request, response) => {
    try {
        if (
            !request.body.username ||
            !request.body.password
        ) {
            return response.status(400).send({
                message: "Username and Password fields are required",
            });
        }
        const newUser = {
            username: request.body.username,
            password: request.body.password, 
        }

        const user = await User.create(newUser);
        return response.status(201).send(user);
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
});

// GET request for user 
app.get("/users", async (request, response) => {
    try {
        const users = await User.find({});
        return response.status(200).json(users);
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
});