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

// POST REQUEST TO ADD USER
router.route('/').post((request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    const newUser = new User({username, password});

    newUser.save()
    .then(() => response.json('User Added!')) // IF USER IS SUCCESSFULLY ADDED
    .catch(err => response.status(400).json('Error: ' + err)); // if there's an error return that instead
})

module.exports = router