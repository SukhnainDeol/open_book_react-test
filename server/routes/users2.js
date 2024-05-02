const router = require('express').Router()

let User2 = require('../models/user.model2.js')

// GET REQUESTS TO GET USERS
router.route('/').get((request, response) => {
    // mongoose function to find all users
    User2.find()
    .then(
        users => response.json(users)) // returns all the users from the database
    .catch(
        err => response.status(400).json('Error: ' + err)); // if there's an error return that instead
})

// POST REQUEST TO ADD USER
router.route('/add').post((request, response) => {
    const username = req.body.username;
    const password = req.body.password;

    const newUser = new User2({username, password});

    newUser.save()
    .then(() => response.json('User Added!')) // IF USER IS SUCCESSFULLY ADDED
    .catch(err => response.status(400).json('Error: ' + err)); // if there's an error return that instead
})

modules.exports = router