const router = require('express').Router()

let User = require('../models/user.model.js')

// GET REQUESTS TO GET USERS
router.route('/').get((request, response) => {
    // mongoose function to find all users
    User.find()
    .then(
        users => response.json(users)) // returns all the users from the database
    .catch(
        err => response.status(400).json('Error: ' + err)); // if there's an error return that instead
})

// GET REQUEST TO GET SPECIFIC USER
router.route('/:username').get( async (request, response) => {
    try {
        // get user by filtering
        const username = request.params.username;
        const user = await User.find({username: {$eq: username}});

        // check if it worked
        if (!user) {
            return response.status(404).json({message: "User not found"});
        }

        // success response
        return response.status(200).json(user);
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})

// POST REQUEST TO ADD USER
router.route('/').post((request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    const newUser = new User({username, password});

    newUser.save()
    .then(() => response.json('User Added!')) // IF USER IS SUCCESSFULLY ADDED
    .catch(err => response.status(400).json('Error: ' + err)); // if there's an error return that instead
})


// PUT REQUEST TO EDIT USER
router.route('/:id').put( async (request, response) => {
    try {
        // check params
        if (
            !request.body.username ||
            !request.body.password
        ) {
            return response.status(400).send({
                message: "Username and Password fields are required",
            });
        }

        // get user
        const id = request.params.id;
        const user = await User.findByIdAndUpdate(id, request.body);

        // check if it worked
        if (!user) {
            return response.status(404).json({message: "User not found"});
        }

        // success response
        return response.status(201).send({message: "User Updated Successfully!"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})


// DELETE REQUEST TO DELETE USER
router.route('/:id').delete( async (request, response) => {
    try {
        // get user
        const id = request.params.id;
        const user = await User.findByIdAndDelete(id);

        // check if it worked
        if (!user) {
            return response.status(404).json({message: "User not found"});
        }

        // success response
        return response.status(201).send({message: "User Deleted Successfully!"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})



module.exports = router